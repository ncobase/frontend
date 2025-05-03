import { useState, useCallback } from 'react';

import { AlertDialog } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useUpdateTenant } from '../service';
import { Tenant } from '../tenant';

export const useTenantStatusToggle = (onSuccess, onError) => {
  const { t } = useTranslation();
  const updateTenantMutation = useUpdateTenant();

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    tenant: null as Tenant | null,
    action: '' as 'enable' | 'disable'
  });

  const handleToggleStatus = useCallback((tenant: Tenant) => {
    const action = tenant.disabled ? 'enable' : 'disable';

    setConfirmDialog({
      open: true,
      tenant,
      action
    });
  }, []);

  const confirmToggleStatus = useCallback(() => {
    if (!confirmDialog.tenant) return;

    const updatedTenant = {
      ...confirmDialog.tenant,
      disabled: !confirmDialog.tenant.disabled
    };

    updateTenantMutation.mutate(updatedTenant, {
      onSuccess: () => {
        setConfirmDialog({ open: false, tenant: null, action: 'enable' });
        onSuccess(
          confirmDialog.action === 'enable'
            ? t('tenant.messages.enable_success', 'Tenant enabled successfully')
            : t('tenant.messages.disable_success', 'Tenant disabled successfully')
        );
      },
      onError: error => {
        setConfirmDialog({ open: false, tenant: null, action: 'enable' });
        onError(error);
      }
    });
  }, [confirmDialog, updateTenantMutation, onSuccess, onError, t]);

  const StatusToggleDialog = () => (
    <AlertDialog
      title={
        confirmDialog.action === 'enable'
          ? t('tenant.dialogs.enable_title', 'Enable Tenant')
          : t('tenant.dialogs.disable_title', 'Disable Tenant')
      }
      description={
        confirmDialog.action === 'enable'
          ? t(
              'tenant.dialogs.enable_description',
              'Are you sure you want to enable this tenant? Users will regain access to this tenant.'
            )
          : t(
              'tenant.dialogs.disable_description',
              'Are you sure you want to disable this tenant? This will prevent users from accessing it.'
            )
      }
      isOpen={confirmDialog.open}
      onChange={() => setConfirmDialog(prev => ({ ...prev, open: !prev.open }))}
      cancelText='Discard'
      confirmText='Save'
      onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      onConfirm={confirmToggleStatus}
    />
  );

  return {
    handleToggleStatus,
    StatusToggleDialog
  };
};
