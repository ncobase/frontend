import { useCallback } from 'react';

import { useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useCreateSnapshot } from '../service';

interface UseVersioningProps {
  contentId: string;
  contentType: string;
  onSnapshotCreated?: () => void;
}

export const useVersioning = ({
  contentId,
  contentType,
  onSnapshotCreated
}: UseVersioningProps) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const createSnapshotMutation = useCreateSnapshot();

  const createSnapshot = useCallback(
    async (data: any, changeSummary?: string, changeType: string = 'update') => {
      try {
        await createSnapshotMutation.mutateAsync({
          contentId,
          contentType,
          data: { ...data, change_type: changeType },
          changeSummary
        });

        toast.success(t('version.snapshot.created'));
        onSnapshotCreated?.();
      } catch (error) {
        toast.error(t('version.snapshot.error'));
        console.error('Failed to create snapshot:', error);
      }
    },
    [contentId, contentType, createSnapshotMutation, toast, t, onSnapshotCreated]
  );

  const createAutoSnapshot = useCallback(
    async (data: any, changeType: string = 'auto_save') => {
      // Auto-snapshot without user notification
      try {
        await createSnapshotMutation.mutateAsync({
          contentId,
          contentType,
          data: { ...data, change_type: changeType },
          changeSummary: `Auto-save: ${new Date().toISOString()}`
        });
      } catch (error) {
        console.error('Failed to create auto-snapshot:', error);
      }
    },
    [contentId, contentType, createSnapshotMutation]
  );

  return {
    createSnapshot,
    createAutoSnapshot,
    isCreatingSnapshot: createSnapshotMutation.isPending
  };
};
