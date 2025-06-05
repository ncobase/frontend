import { useState, useCallback } from 'react';

import {
  useToastMessage,
  Badge,
  Button,
  Dropdown,
  DropdownTrigger,
  Icons,
  DropdownContent,
  DropdownItem,
  AlertDialog
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { Permission } from '../permission';
import { useDeletePermission, useUpdatePermission } from '../service';

export const PermissionBulkActions = ({
  selectedPermissions,
  onSelectionChange,
  onSuccess
}: {
  selectedPermissions: Permission[];
  onSelectionChange: (_permissions: Permission[]) => void;
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: string;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    action: '',
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const deletePermissionMutation = useDeletePermission();
  const updatePermissionMutation = useUpdatePermission();

  const handleBulkDelete = useCallback(() => {
    const nonDefaultPermissions = selectedPermissions.filter(p => !p.default);

    if (nonDefaultPermissions.length === 0) {
      toast.warning(t('permission.bulk.no_deletable'), {
        description: t('permission.bulk.default_cannot_delete')
      });
      return;
    }

    setConfirmDialog({
      open: true,
      action: 'delete',
      title: t('permission.bulk.confirm_delete_title'),
      description: t('permission.bulk.confirm_delete_description', {
        count: nonDefaultPermissions.length
      }),
      onConfirm: async () => {
        try {
          await Promise.all(
            nonDefaultPermissions.map(permission =>
              deletePermissionMutation.mutateAsync(permission.id)
            )
          );

          toast.success(t('messages.success'), {
            description: t('permission.bulk.delete_success', {
              count: nonDefaultPermissions.length
            })
          });

          onSelectionChange([]);
          onSuccess?.();
        } catch (error) {
          toast.error(t('messages.error'), {
            description: error['message'] || t('permission.bulk.delete_failed')
          });
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  }, [selectedPermissions, deletePermissionMutation, toast, t, onSelectionChange, onSuccess]);

  const handleBulkEnable = useCallback(() => {
    const disabledPermissions = selectedPermissions.filter(p => p.disabled);

    if (disabledPermissions.length === 0) {
      toast.info(t('permission.bulk.no_disabled'));
      return;
    }

    setConfirmDialog({
      open: true,
      action: 'enable',
      title: t('permission.bulk.confirm_enable_title'),
      description: t('permission.bulk.confirm_enable_description', {
        count: disabledPermissions.length
      }),
      onConfirm: async () => {
        try {
          await Promise.all(
            disabledPermissions.map(permission =>
              updatePermissionMutation.mutateAsync({
                ...permission,
                disabled: false
              })
            )
          );

          toast.success(t('messages.success'), {
            description: t('permission.bulk.enable_success', {
              count: disabledPermissions.length
            })
          });

          onSuccess?.();
        } catch (error) {
          toast.error(t('messages.error'), {
            description: error['message'] || t('permission.bulk.enable_failed')
          });
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  }, [selectedPermissions, updatePermissionMutation, toast, t, onSuccess]);

  const handleBulkDisable = useCallback(() => {
    const enabledPermissions = selectedPermissions.filter(p => !p.disabled);

    if (enabledPermissions.length === 0) {
      toast.info(t('permission.bulk.no_enabled'));
      return;
    }

    setConfirmDialog({
      open: true,
      action: 'disable',
      title: t('permission.bulk.confirm_disable_title'),
      description: t('permission.bulk.confirm_disable_description', {
        count: enabledPermissions.length
      }),
      onConfirm: async () => {
        try {
          await Promise.all(
            enabledPermissions.map(permission =>
              updatePermissionMutation.mutateAsync({
                ...permission,
                disabled: true
              })
            )
          );

          toast.success(t('messages.success'), {
            description: t('permission.bulk.disable_success', {
              count: enabledPermissions.length
            })
          });

          onSuccess?.();
        } catch (error) {
          toast.error(t('messages.error'), {
            description: error['message'] || t('permission.bulk.disable_failed')
          });
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  }, [selectedPermissions, updatePermissionMutation, toast, t, onSuccess]);

  if (selectedPermissions.length === 0) return null;

  return (
    <>
      <div className='flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200'>
        <Badge variant='primary'>
          {t('permission.bulk.selected_count', { count: selectedPermissions.length })}
        </Badge>

        <div className='flex items-center space-x-1'>
          <Button variant='outline-slate' size='sm' onClick={() => onSelectionChange([])}>
            {t('actions.clear')}
          </Button>

          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant='outline-primary' size='sm'>
                <Icons name='IconSettings' className='mr-1' />
                {t('permission.bulk.actions')}
                <Icons name='IconChevronDown' className='ml-1' />
              </Button>
            </DropdownTrigger>
            <DropdownContent align='start'>
              <DropdownItem onClick={handleBulkEnable}>
                <Icons name='IconCircleCheck' className='mr-2 text-green-500' />
                {t('permission.bulk.enable_selected')}
              </DropdownItem>
              <DropdownItem onClick={handleBulkDisable}>
                <Icons name='IconCircleMinus' className='mr-2 text-orange-500' />
                {t('permission.bulk.disable_selected')}
              </DropdownItem>
              <DropdownItem onClick={handleBulkDelete} className='text-red-600 hover:text-red-700'>
                <Icons name='IconTrash' className='mr-2' />
                {t('permission.bulk.delete_selected')}
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>

      <AlertDialog
        title={confirmDialog.title}
        description={confirmDialog.description}
        isOpen={confirmDialog.open}
        onChange={() => setConfirmDialog(prev => ({ ...prev, open: !prev.open }))}
        cancelText={t('actions.cancel')}
        confirmText={t(`actions.${confirmDialog.action}`)}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        onConfirm={confirmDialog.onConfirm}
      />
    </>
  );
};
