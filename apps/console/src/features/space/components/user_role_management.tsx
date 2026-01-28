import { useState } from 'react';

import {
  Modal,
  Button,
  SelectField,
  Badge,
  Icons,
  useToastMessage,
  AlertDialog
} from '@ncobase/react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  useQueryUserSpaceRoles,
  useAddUserToSpaceRole,
  useRemoveUserFromSpaceRole
} from '../service';

import { useListRoles } from '@/features/system/role/service';

interface SpaceUserRoleManagementProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
  user: any;
  onSuccess?: () => void;
}

export const SpaceUserRoleManagement: React.FC<SpaceUserRoleManagementProps> = ({
  isOpen,
  onClose,
  spaceId,
  user,
  onSuccess
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [showAddRole, setShowAddRole] = useState(false);
  const [removeDialog, setRemoveDialog] = useState({ open: false, roleId: '', roleName: '' });

  const { data: userRoles, isLoading, refetch } = useQueryUserSpaceRoles(spaceId, user?.user_id);
  const { data: rolesData } = useListRoles({ limit: 100 });
  const addRoleMutation = useAddUserToSpaceRole();
  const removeRoleMutation = useRemoveUserFromSpaceRole();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const roles = rolesData?.items || [];
  const assignedRoleIds = userRoles?.role_ids || [];
  const availableRoles = roles.filter(role => !assignedRoleIds.includes(role.id));

  const handleAddRole = async (data: any) => {
    try {
      await addRoleMutation.mutateAsync({
        spaceId,
        user_id: user.user_id,
        role_id: data.role_id
      });

      toast.success(t('messages.success'), {
        description: t('space.users.roles.add_success')
      });

      setShowAddRole(false);
      reset();
      refetch();
      onSuccess?.();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.users.roles.add_failed')
      });
    }
  };

  const handleRemoveRole = async () => {
    if (!removeDialog.roleId) return;

    try {
      await removeRoleMutation.mutateAsync({
        spaceId,
        userId: user.user_id,
        roleId: removeDialog.roleId
      });

      toast.success(t('messages.success'), {
        description: t('space.users.roles.remove_success')
      });

      setRemoveDialog({ open: false, roleId: '', roleName: '' });
      refetch();
      onSuccess?.();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.users.roles.remove_failed')
      });
    }
  };

  if (!user) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onCancel={onClose}
        title={t('space.users.roles.manage_title')}
        description={`${t('space.users.roles.manage_description')} "${user.username}"`}
        className='max-w-4xl'
        onConfirm={showAddRole ? () => setShowAddRole(true) : undefined}
        // footer={
        //   <div className='flex items-center justify-between'>
        //     <Button
        //       variant='outline-primary'
        //       onClick={() => setShowAddRole(true)}
        //       disabled={availableRoles.length === 0}
        //     >
        //       <Icons name='IconPlus' className='mr-2' />
        //       {t('space.users.roles.add_role')}
        //     </Button>
        //     <Button onClick={onClose}>{t('actions.close')}</Button>
        //   </div>
        // }
      >
        <div className='space-y-6'>
          {/* User Info Banner */}
          <div className='bg-slate-50 p-4 rounded-lg'>
            <div className='flex items-center space-x-3'>
              <Icons name='IconUser' className='text-slate-500' />
              <div>
                <div className='font-medium'>{user.username}</div>
                <div className='text-sm text-slate-600'>{user.email}</div>
              </div>
              <div className='ml-auto'>
                <Badge variant='outline-primary'>
                  {t('space.users.roles.roles_count', { count: assignedRoleIds.length })}
                </Badge>
              </div>
            </div>
          </div>

          {/* Current Roles */}
          <div>
            <h3 className='text-lg font-medium mb-4'>{t('space.users.roles.current_roles')}</h3>

            {isLoading ? (
              <div className='text-center py-8'>
                <Icons name='IconLoader' className='animate-spin mx-auto mb-4' />
                {t('common.loading')}
              </div>
            ) : assignedRoleIds.length === 0 ? (
              <div className='text-center py-8 text-slate-500'>
                <Icons name='IconUserCheck' className='w-12 h-12 mx-auto mb-4 text-slate-300' />
                {t('space.users.roles.no_roles')}
              </div>
            ) : (
              <div className='space-y-3'>
                {assignedRoleIds.map(roleId => {
                  const role = roles.find(r => r.id === roleId);
                  return (
                    <RoleItem
                      key={roleId}
                      role={role}
                      onRemove={() =>
                        setRemoveDialog({
                          open: true,
                          roleId,
                          roleName: role?.name || roleId
                        })
                      }
                      t={t}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Role Statistics */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center p-3 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>{assignedRoleIds.length}</div>
              <div className='text-sm text-blue-800'>{t('space.users.roles.assigned')}</div>
            </div>
            <div className='text-center p-3 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>{availableRoles.length}</div>
              <div className='text-sm text-green-800'>{t('space.users.roles.available')}</div>
            </div>
            <div className='text-center p-3 bg-purple-50 rounded-lg'>
              <div className='text-2xl font-bold text-purple-600'>{roles.length}</div>
              <div className='text-sm text-purple-800'>{t('space.users.roles.total')}</div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Role Modal */}
      <Modal
        isOpen={showAddRole}
        onCancel={() => {
          setShowAddRole(false);
          reset();
        }}
        title={t('space.users.roles.add_role_title')}
        confirmText={t('actions.add')}
        onConfirm={handleSubmit(handleAddRole)}
      >
        <div className='space-y-4'>
          <div className='bg-blue-50 p-3 rounded-lg'>
            <p className='text-sm text-blue-800'>{t('space.users.roles.add_role_description')}</p>
          </div>

          <Controller
            name='role_id'
            control={control}
            rules={{ required: t('forms.select_required') }}
            render={({ field }) => (
              <SelectField
                label={t('space.users.roles.select_role')}
                placeholder={t('space.users.roles.select_role_placeholder')}
                options={availableRoles.map(role => ({
                  label: role.name,
                  value: role.id,
                  description: role.description
                }))}
                error={errors.role_id?.message}
                {...field}
              />
            )}
          />

          {availableRoles.length === 0 && (
            <div className='bg-yellow-50 p-3 rounded-lg'>
              <p className='text-sm text-yellow-800'>{t('space.users.roles.no_available_roles')}</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Remove Role Confirmation */}
      <AlertDialog
        title={t('space.users.roles.remove_confirm_title')}
        description={t('space.users.roles.remove_confirm_description', {
          role: removeDialog.roleName,
          user: user.username
        })}
        isOpen={removeDialog.open}
        onChange={() => setRemoveDialog(prev => ({ ...prev, open: !prev.open }))}
        cancelText={t('actions.cancel')}
        confirmText={t('actions.remove')}
        onCancel={() => setRemoveDialog({ open: false, roleId: '', roleName: '' })}
        onConfirm={handleRemoveRole}
      />
    </>
  );
};

// Role Item Component
const RoleItem = ({ role, onRemove, t }: any) => {
  if (!role) {
    return (
      <div className='flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200'>
        <div>
          <div className='font-medium text-red-800'>{t('space.users.roles.role_not_found')}</div>
          <div className='text-sm text-red-600'>
            {t('space.users.roles.role_not_found_description')}
          </div>
        </div>
        <Button variant='outline-danger' size='xs' onClick={onRemove}>
          <Icons name='IconTrash' size={12} />
        </Button>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-between p-3 border border-slate-200/60  rounded-lg hover:bg-slate-50'>
      <div className='flex-1'>
        <div className='flex items-center space-x-2'>
          <span className='font-medium'>{role.name}</span>
          {role.disabled && (
            <Badge variant='danger' size='xs'>
              {t('common.disabled')}
            </Badge>
          )}
        </div>
        {role.description && <div className='text-sm text-slate-600 mt-1'>{role.description}</div>}
        <div className='text-xs text-slate-500 mt-1'>
          {t('space.users.roles.role_id')}: {role.id}
        </div>
      </div>
      <div className='flex items-center space-x-2'>
        <Button variant='outline-danger' size='xs' onClick={onRemove}>
          <Icons name='IconTrash' size={12} />
        </Button>
      </div>
    </div>
  );
};
