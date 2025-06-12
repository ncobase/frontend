import { useState, useCallback } from 'react';

import { AlertDialog } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useUpdateSpace } from '../service';
import { Space } from '../space';

export const useSpaceStatusToggle = (onSuccess, onError) => {
  const { t } = useTranslation();
  const updateSpaceMutation = useUpdateSpace();

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    space: null as Space | null,
    action: '' as 'enable' | 'disable'
  });

  const handleToggleStatus = useCallback((space: Space) => {
    const action = space.disabled ? 'enable' : 'disable';

    setConfirmDialog({
      open: true,
      space,
      action
    });
  }, []);

  const confirmToggleStatus = useCallback(() => {
    if (!confirmDialog.space) return;

    const updatedSpace = {
      ...confirmDialog.space,
      disabled: !confirmDialog.space.disabled
    };

    updateSpaceMutation.mutate(updatedSpace, {
      onSuccess: () => {
        setConfirmDialog({ open: false, space: null, action: 'enable' });
        onSuccess(
          confirmDialog.action === 'enable'
            ? t('space.messages.enable_success', 'Space enabled successfully')
            : t('space.messages.disable_success', 'Space disabled successfully')
        );
      },
      onError: error => {
        setConfirmDialog({ open: false, space: null, action: 'enable' });
        onError(error);
      }
    });
  }, [confirmDialog, updateSpaceMutation, onSuccess, onError, t]);

  const StatusToggleDialog = () => (
    <AlertDialog
      title={
        confirmDialog.action === 'enable'
          ? t('space.dialogs.enable_title', 'Enable Space')
          : t('space.dialogs.disable_title', 'Disable Space')
      }
      description={
        confirmDialog.action === 'enable'
          ? t(
              'space.dialogs.enable_description',
              'Are you sure you want to enable this space? Users will regain access to this space.'
            )
          : t(
              'space.dialogs.disable_description',
              'Are you sure you want to disable this space? This will prevent users from accessing it.'
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
