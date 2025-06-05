import { useState } from 'react';

import {
  Button,
  Modal,
  SelectField,
  Badge,
  Icons,
  useToastMessage,
  AlertDialog
} from '@ncobase/react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useListRoles } from '../../role/service';
import { useBulkUpdateUserTenantRoles } from '../service';

interface TenantUserBulkActionsProps {
  tenantId: string;
  selectedUsers: any[];
  onSelectionChange: (_users: any[]) => void;
  onSuccess: () => void;
}

export const TenantUserBulkActions: React.FC<TenantUserBulkActionsProps> = ({
  tenantId,
  selectedUsers,
  onSelectionChange,
  onSuccess
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'assign' | 'remove' | 'update' | 'deactivate'>(
    'assign'
  );
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '' });

  const { data: rolesData } = useListRoles({ limit: 100 });
  const bulkUpdateMutation = useBulkUpdateUserTenantRoles();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const roles = rolesData?.items || [];

  const handleBulkAction = () => {
    if (selectedUsers.length === 0) {
      toast.error(t('messages.error'), {
        description: t('tenant.users.bulk.no_selection')
      });
      return;
    }
    setShowBulkModal(true);
  };

  const onSubmit = async (data: any) => {
    try {
      let updates: any[] = [];

      switch (bulkAction) {
        case 'assign':
          updates = selectedUsers.map(user => ({
            user_id: user.user_id,
            role_id: data.role_id,
            operation: 'add'
          }));
          break;

        case 'remove':
          updates = selectedUsers.flatMap(user =>
            (data.role_ids || []).map(roleId => ({
              user_id: user.user_id,
              role_id: roleId,
              operation: 'remove'
            }))
          );
          break;

        case 'update':
          updates = selectedUsers.map(user => ({
            user_id: user.user_id,
            role_id: data.new_role_id,
            operation: 'update',
            old_role_id: data.old_role_id
          }));
          break;

        case 'deactivate':
          updates = selectedUsers.map(user => ({
            user_id: user.user_id,
            operation: 'deactivate'
          }));
          break;
      }

      await bulkUpdateMutation.mutateAsync({
        tenantId,
        updates
      });

      toast.success(t('messages.success'), {
        description: t('tenant.users.bulk.success', { count: selectedUsers.length })
      });

      setShowBulkModal(false);
      reset();
      onSelectionChange([]);
      onSuccess();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('tenant.users.bulk.failed')
      });
    }
  };

  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50'>
        <div className='bg-white border border-slate-200/60 rounded-lg shadow-lg p-4'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <Badge variant='primary'>{selectedUsers.length}</Badge>
              <span className='text-sm font-medium'>{t('tenant.users.bulk.selected')}</span>
            </div>

            <div className='flex items-center space-x-2'>
              <Button
                variant='outline-primary'
                size='sm'
                onClick={() => {
                  setBulkAction('assign');
                  handleBulkAction();
                }}
              >
                <Icons name='IconUserPlus' className='mr-1' />
                {t('tenant.users.bulk.assign_roles')}
              </Button>

              <Button
                variant='outline-warning'
                size='sm'
                onClick={() => {
                  setBulkAction('remove');
                  handleBulkAction();
                }}
              >
                <Icons name='IconUserMinus' className='mr-1' />
                {t('tenant.users.bulk.remove_roles')}
              </Button>

              <Button
                variant='outline-danger'
                size='sm'
                onClick={() => {
                  setBulkAction('deactivate');
                  setConfirmDialog({ open: true, action: 'deactivate' });
                }}
              >
                <Icons name='IconUserX' className='mr-1' />
                {t('tenant.users.bulk.deactivate')}
              </Button>

              <Button variant='outline-slate' size='sm' onClick={() => onSelectionChange([])}>
                <Icons name='IconX' className='mr-1' />
                {t('actions.clear')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Modal */}
      <Modal
        isOpen={showBulkModal}
        onCancel={() => {
          setShowBulkModal(false);
          reset();
        }}
        title={t(`tenant.users.bulk.${bulkAction}_title`)}
        confirmText={t(`actions.${bulkAction}`)}
        onConfirm={handleSubmit(onSubmit)}
        className='max-w-2xl'
      >
        <BulkActionForm
          action={bulkAction}
          control={control}
          errors={errors}
          roles={roles}
          selectedUsers={selectedUsers}
          t={t}
        />
      </Modal>

      {/* Confirmation Dialog */}
      <AlertDialog
        title={t('tenant.users.bulk.confirm_title')}
        description={t('tenant.users.bulk.confirm_description', {
          action: t(`tenant.users.bulk.${confirmDialog.action}`),
          count: selectedUsers.length
        })}
        isOpen={confirmDialog.open}
        onChange={() => setConfirmDialog(prev => ({ ...prev, open: !prev.open }))}
        cancelText={t('actions.cancel')}
        confirmText={t(`actions.${confirmDialog.action}`)}
        onCancel={() => setConfirmDialog({ open: false, action: '' })}
        onConfirm={() => {
          setConfirmDialog({ open: false, action: '' });
          if (confirmDialog.action === 'deactivate') {
            onSubmit({ action: 'deactivate' });
          }
        }}
      />
    </>
  );
};

// Bulk Action Form Component
const BulkActionForm = ({ action, control, errors, roles, selectedUsers, t }: any) => {
  const renderActionForm = () => {
    switch (action) {
      case 'assign':
        return (
          <div className='space-y-4'>
            <div className='bg-blue-50 p-3 rounded-lg'>
              <p className='text-sm text-blue-800'>
                {t('tenant.users.bulk.assign_description', { count: selectedUsers.length })}
              </p>
            </div>

            <Controller
              name='role_id'
              control={control}
              rules={{ required: t('forms.select_required') }}
              render={({ field }) => (
                <SelectField
                  label={t('tenant.users.bulk.select_role')}
                  placeholder={t('tenant.users.bulk.select_role_placeholder')}
                  options={roles.map(role => ({
                    label: role.name,
                    value: role.id,
                    description: role.description
                  }))}
                  error={errors.role_id?.message}
                  {...field}
                />
              )}
            />
          </div>
        );

      case 'remove':
        return (
          <div className='space-y-4'>
            <div className='bg-yellow-50 p-3 rounded-lg'>
              <p className='text-sm text-yellow-800'>
                {t('tenant.users.bulk.remove_description', { count: selectedUsers.length })}
              </p>
            </div>

            <Controller
              name='role_ids'
              control={control}
              rules={{ required: t('forms.select_required') }}
              render={({ field }) => (
                <SelectField
                  multiple
                  label={t('tenant.users.bulk.select_roles_to_remove')}
                  placeholder={t('tenant.users.bulk.select_roles_placeholder')}
                  options={roles.map(role => ({
                    label: role.name,
                    value: role.id
                  }))}
                  error={errors.role_ids?.message}
                  {...field}
                />
              )}
            />
          </div>
        );

      case 'update':
        return (
          <div className='space-y-4'>
            <div className='bg-purple-50 p-3 rounded-lg'>
              <p className='text-sm text-purple-800'>
                {t('tenant.users.bulk.update_description', { count: selectedUsers.length })}
              </p>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <Controller
                name='old_role_id'
                control={control}
                rules={{ required: t('forms.select_required') }}
                render={({ field }) => (
                  <SelectField
                    label={t('tenant.users.bulk.old_role')}
                    options={roles.map(role => ({
                      label: role.name,
                      value: role.id
                    }))}
                    error={errors.old_role_id?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name='new_role_id'
                control={control}
                rules={{ required: t('forms.select_required') }}
                render={({ field }) => (
                  <SelectField
                    label={t('tenant.users.bulk.new_role')}
                    options={roles.map(role => ({
                      label: role.name,
                      value: role.id
                    }))}
                    error={errors.new_role_id?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='space-y-4'>
      {/* Selected Users Preview */}
      <div className='bg-slate-50 p-3 rounded-lg'>
        <h4 className='text-sm font-medium mb-2'>
          {t('tenant.users.bulk.selected_users')} ({selectedUsers.length})
        </h4>
        <div className='flex flex-wrap gap-1 max-h-20 overflow-y-auto'>
          {selectedUsers.map(user => (
            <Badge key={user.user_id} variant='outline-slate' size='sm'>
              {user.username}
            </Badge>
          ))}
        </div>
      </div>

      {renderActionForm()}
    </div>
  );
};
