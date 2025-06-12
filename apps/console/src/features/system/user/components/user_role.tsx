import { useState, useEffect, useCallback } from 'react';

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

interface UserRoleProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  currentSpaceId?: string;
  onSuccess?: () => void;
}

export const UserRole: React.FC<UserRoleProps> = ({
  isOpen,
  onClose,
  user,
  currentSpaceId,
  onSuccess
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('system');

  // Fetch available roles
  const { data: rolesData, isLoading: rolesLoading } = useListRoles({
    limit: 100,
    search: searchTerm
  });

  // Fetch user's current system roles
  const { data: userRoles, isLoading: userRolesLoading } = useQueryUserRoles(user?.id);

  // Fetch user's space-specific roles if space is selected
  const { data: userSpaceRoles, isLoading: spaceRolesLoading } = useQueryUserSpaceRoles(
    user?.id,
    currentSpaceId,
    { enabled: !!currentSpaceId }
  );

  const assignRolesMutation = useAssignRoles();
  const removeRolesMutation = useRemoveRoles();

  const roles = rolesData?.items || [];
  const currentUserRoles = activeTab === 'system' ? userRoles || [] : userSpaceRoles || [];

  useEffect(() => {
    if (currentUserRoles && currentUserRoles.length > 0) {
      setSelectedRoles(currentUserRoles.map(role => role.id));
    }
  }, [currentUserRoles]);

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
    if (!user?.id) return;

    const currentRoleIds = currentUserRoles.map(role => role.id);
    const toAdd = selectedRoles.filter(id => !currentRoleIds.includes(id));
    const toRemove = currentRoleIds.filter(id => !selectedRoles.includes(id));

    try {
      // Add new roles
      if (toAdd.length > 0) {
        await assignRolesMutation.mutateAsync({
          userId: user.id,
          roleIds: toAdd
          // spaceId: activeTab === 'space' ? currentSpaceId : undefined
        });
      }

      // Remove old roles
      if (toRemove.length > 0) {
        await removeRolesMutation.mutateAsync({
          userId: user.id,
          roleIds: toRemove
          // spaceId: activeTab === 'space' ? currentSpaceId : undefined
        });
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
    user?.id,
    currentUserRoles,
    selectedRoles,
    assignRolesMutation,
    removeRolesMutation,
    activeTab,
    currentSpaceId,
    toast,
    t,
    onSuccess,
    onClose
  ]);

  const isLoading = rolesLoading || userRolesLoading || spaceRolesLoading;

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onCancel={onClose}
      title={t('user.roles.manage_title')}
      description={`${t('user.roles.manage_description')} "${user.username}"`}
      confirmText={t('actions.save')}
      onConfirm={handleSave}
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
            {currentSpaceId && (
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
              t={t}
            />
          </TabsContent>

          {currentSpaceId && (
            <TabsContent value='space' className='space-y-4'>
              <div className='bg-blue-50 p-3 rounded-lg mb-4'>
                <div className='text-blue-800 text-sm'>{t('user.roles.space_context_info')}</div>
              </div>
              <RoleManagementContent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredRoles={filteredRoles}
                selectedRoles={selectedRoles}
                onRoleToggle={handleRoleToggle}
                isLoading={isLoading}
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
                disabled={role.disabled}
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
