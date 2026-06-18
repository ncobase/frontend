import { useState, useEffect, useCallback, useMemo } from 'react';

import {
  Modal,
  InputField,
  Badge,
  Checkbox,
  Icons,
  useToastMessage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useListRoles } from '../../role/service';
import {
  useQueryUserRoles,
  useAssignRoles,
  useRemoveRoles,
  useQueryUserSpaceRoles
} from '../service';

import { useAddUserToSpaceRole, useRemoveUserFromSpaceRole } from '@/features/space/service';

interface UserRoleProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  currentSpaceId?: string;
  canReadSpaceRoles?: boolean;
  canManageSpaceRoles?: boolean;
  onSuccess?: () => void;
}

const EMPTY_ROLE_IDS: string[] = [];

const extractRoleIds = (roles: any): string[] => {
  if (!roles) return EMPTY_ROLE_IDS;
  if (Array.isArray(roles)) {
    return roles
      .map(role => {
        if (typeof role === 'string') return role;
        return role?.id || role?.role_id;
      })
      .filter(Boolean);
  }
  if (Array.isArray(roles.role_ids)) return roles.role_ids.filter(Boolean);
  return EMPTY_ROLE_IDS;
};

const areRoleIdsEqual = (left: string[], right: string[]) => {
  if (left.length !== right.length) return false;
  return left.every((roleId, index) => roleId === right[index]);
};

export const UserRole: React.FC<UserRoleProps> = ({
  isOpen,
  onClose,
  user,
  currentSpaceId,
  canReadSpaceRoles = !!currentSpaceId,
  canManageSpaceRoles = !!currentSpaceId,
  onSuccess
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('system');
  const targetUserId = user?.id || user?.user_id;
  const targetUserName = user?.username || user?.email || targetUserId || '';

  // Fetch available roles
  const { data: rolesData, isLoading: rolesLoading } = useListRoles({
    limit: 100,
    search: searchTerm
  });

  // Fetch user's current system roles
  const { data: userRoles, isLoading: userRolesLoading } = useQueryUserRoles(targetUserId);

  // Fetch user's space-specific roles if space is selected
  const { data: userSpaceRoles, isLoading: spaceRolesLoading } = useQueryUserSpaceRoles(
    targetUserId,
    currentSpaceId,
    {
      enabled: isOpen && activeTab === 'space' && canReadSpaceRoles
    }
  );

  const assignRolesMutation = useAssignRoles();
  const removeRolesMutation = useRemoveRoles();
  const addSpaceRoleMutation = useAddUserToSpaceRole();
  const removeSpaceRoleMutation = useRemoveUserFromSpaceRole();

  const roles = rolesData?.items || [];
  const systemRoleIds = useMemo(() => extractRoleIds(userRoles), [userRoles]);
  const spaceRoleIds = useMemo(() => extractRoleIds(userSpaceRoles), [userSpaceRoles]);
  const currentRoleIds = activeTab === 'system' ? systemRoleIds : spaceRoleIds;

  useEffect(() => {
    if ((!currentSpaceId || !canReadSpaceRoles) && activeTab === 'space') {
      setActiveTab('system');
    }
  }, [activeTab, canReadSpaceRoles, currentSpaceId]);

  useEffect(() => {
    setSelectedRoles(prev => (areRoleIdsEqual(prev, currentRoleIds) ? prev : [...currentRoleIds]));
  }, [currentRoleIds]);

  const filteredRoles = roles.filter(
    role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleToggle = useCallback((roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!targetUserId) {
      toast.error(t('messages.error'), {
        description: t('user.roles.missing_user', 'User ID is required before roles can be saved.')
      });
      return;
    }

    if (activeTab === 'space' && (!currentSpaceId || !canManageSpaceRoles)) {
      toast.error(t('messages.error'), {
        description: t(
          'user.roles.missing_space',
          'A manageable space must be selected before space roles can be saved.'
        )
      });
      return;
    }

    const toAdd = selectedRoles.filter(id => !currentRoleIds.includes(id));
    const toRemove = currentRoleIds.filter(id => !selectedRoles.includes(id));

    try {
      if (activeTab === 'space') {
        await Promise.all([
          ...toAdd.map(roleId =>
            addSpaceRoleMutation.mutateAsync({
              spaceId: currentSpaceId!,
              user_id: targetUserId,
              role_id: roleId
            })
          ),
          ...toRemove.map(roleId =>
            removeSpaceRoleMutation.mutateAsync({
              spaceId: currentSpaceId!,
              userId: targetUserId,
              roleId
            })
          )
        ]);
      } else {
        if (toAdd.length > 0) {
          await assignRolesMutation.mutateAsync({
            userId: targetUserId,
            roleIds: toAdd
          });
        }

        if (toRemove.length > 0) {
          await removeRolesMutation.mutateAsync({
            userId: targetUserId,
            roleIds: toRemove
          });
        }
      }

      toast.success(t('messages.success'), {
        description: t('user.roles.update_success')
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('user.roles.update_failed')
      });
    }
  }, [
    targetUserId,
    currentRoleIds,
    selectedRoles,
    activeTab,
    currentSpaceId,
    canManageSpaceRoles,
    assignRolesMutation,
    removeRolesMutation,
    addSpaceRoleMutation,
    removeSpaceRoleMutation,
    toast,
    t,
    onSuccess,
    onClose
  ]);

  const isLoading = rolesLoading || (activeTab === 'system' ? userRolesLoading : spaceRolesLoading);
  const isSaving =
    assignRolesMutation.isPending ||
    removeRolesMutation.isPending ||
    addSpaceRoleMutation.isPending ||
    removeSpaceRoleMutation.isPending;
  const cannotManageSelectedSpace = activeTab === 'space' && !canManageSpaceRoles;
  const saveDisabled =
    !targetUserId ||
    isLoading ||
    isSaving ||
    (activeTab === 'space' && (!currentSpaceId || !canManageSpaceRoles));

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onCancel={onClose}
      title={t('user.roles.manage_title')}
      description={`${t('user.roles.manage_description')} "${targetUserName}"`}
      confirmText={t('actions.save')}
      onConfirm={handleSave}
      confirmDisabled={saveDisabled}
      loading={isSaving}
      className='max-w-3xl'
    >
      <div className='space-y-4'>
        {/* User Info */}
        <div className='bg-slate-50 p-3 rounded-lg'>
          <div className='flex items-center space-x-3'>
            <Icons name='IconUser' className='w-5 h-5 text-slate-500' />
            <div>
              <div className='font-medium'>{user.username}</div>
              {user.email && <div className='text-sm text-slate-600'>{user.email}</div>}
            </div>
            {user.is_admin && <Badge variant='warning'>{t('user.labels.admin')}</Badge>}
          </div>
        </div>

        {/* Tabs for System vs Space roles */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value='system'>{t('user.roles.system_roles')}</TabsTrigger>
            {currentSpaceId && canReadSpaceRoles && (
              <TabsTrigger value='space'>{t('user.roles.space_roles')}</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value='system' className='space-y-4'>
            <RoleManagementContent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredRoles={filteredRoles}
              selectedRoles={selectedRoles}
              onRoleToggle={handleRoleToggle}
              isLoading={isLoading}
              disabled={isSaving || !targetUserId}
              t={t}
            />
          </TabsContent>

          {currentSpaceId && canReadSpaceRoles && (
            <TabsContent value='space' className='space-y-4'>
              <div className='bg-blue-50 p-3 rounded-lg mb-4'>
                <div className='text-blue-800 text-sm'>{t('user.roles.space_context_info')}</div>
              </div>
              {cannotManageSelectedSpace && (
                <div className='bg-amber-50 p-3 rounded-lg mb-4'>
                  <div className='text-amber-800 text-sm'>
                    {t(
                      'user.roles.space_readonly_info',
                      'You can review these space roles, but manage:spaces is required to change them.'
                    )}
                  </div>
                </div>
              )}
              <RoleManagementContent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredRoles={filteredRoles}
                selectedRoles={selectedRoles}
                onRoleToggle={handleRoleToggle}
                isLoading={isLoading}
                disabled={isSaving || !targetUserId || !currentSpaceId || !canManageSpaceRoles}
                t={t}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Modal>
  );
};

// Reusable role management content
const RoleManagementContent = ({
  searchTerm,
  setSearchTerm,
  filteredRoles,
  selectedRoles,
  onRoleToggle,
  isLoading,
  disabled,
  t
}) => (
  <>
    {/* Search */}
    <InputField
      placeholder={t('user.roles.search_placeholder')}
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      prependIcon='IconSearch'
    />

    {/* Roles List */}
    <div className='space-y-2 max-h-96 overflow-y-auto'>
      {isLoading ? (
        <div className='text-center py-8 text-slate-500'>{t('common.loading')}</div>
      ) : filteredRoles.length === 0 ? (
        <div className='text-center py-8 text-slate-500'>
          {searchTerm ? t('user.roles.no_results') : t('user.roles.no_roles')}
        </div>
      ) : (
        filteredRoles.map(role => (
          <div
            key={role.id}
            className='flex items-center justify-between p-3 border border-slate-200/50 rounded-lg hover:bg-slate-50'
          >
            <div className='flex items-center space-x-3'>
              <Checkbox
                checked={selectedRoles.includes(role.id)}
                onChange={() => onRoleToggle(role.id)}
                disabled={disabled || role.disabled}
              />
              <div className='flex-1'>
                <div className='flex items-center space-x-2'>
                  <span className='font-medium'>{role.name}</span>
                  {role.disabled && (
                    <Badge variant='warning' size='xs'>
                      {t('common.disabled')}
                    </Badge>
                  )}
                </div>
                {role.slug && <div className='text-sm text-slate-500 font-mono'>{role.slug}</div>}
                {role.description && (
                  <div className='text-sm text-slate-600 mt-1'>{role.description}</div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Selected Summary */}
    {selectedRoles.length > 0 && (
      <div className='bg-green-50 p-3 rounded-lg'>
        <div className='text-green-800'>
          {t('user.roles.selected_count', { count: selectedRoles.length })}
        </div>
      </div>
    )}
  </>
);
