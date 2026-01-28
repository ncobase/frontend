import { useState } from 'react';

import { Button, InputField, Modal, SelectField } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { ResourceFile } from '../resource';
import { useShareFile } from '../service';

interface ShareDialogProps {
  isOpen: boolean;
  file: ResourceFile | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ShareDialog = ({ isOpen, file, onClose, onSuccess }: ShareDialogProps) => {
  const { t } = useTranslation();
  const [accessLevel, setAccessLevel] = useState('shared');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const shareMutation = useShareFile();

  if (!file) return null;

  const handleShare = () => {
    shareMutation.mutate(
      { id: file.id, access_level: accessLevel },
      {
        onSuccess: (data: any) => {
          setShareUrl(data?.url || `${window.location.origin}/res/${file.id}`);
          onSuccess?.();
        }
      }
    );
  };

  const handleCopyUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onCancel={() => {
        setShareUrl(null);
        onClose();
      }}
      title={t('resource.share.title', 'Share File')}
      className='max-w-md'
    >
      <div className='space-y-4 p-4'>
        <p className='text-sm text-slate-500'>{file.original_name || file.name}</p>

        {!shareUrl ? (
          <>
            <div>
              <label className='text-sm font-medium text-slate-700 block mb-1'>
                {t('resource.share.access_level', 'Access Level')}
              </label>
              <SelectField
                value={accessLevel}
                onChange={(val: string) => setAccessLevel(val)}
                options={[
                  { label: t('resource.access.public', 'Public'), value: 'public' },
                  { label: t('resource.access.shared', 'Shared (link only)'), value: 'shared' }
                ]}
              />
            </div>
            <div className='flex justify-end gap-2'>
              <Button variant='outline-slate' onClick={onClose}>
                {t('actions.cancel', 'Cancel')}
              </Button>
              <Button onClick={handleShare} disabled={shareMutation.isPending}>
                {t('resource.share.generate', 'Generate Link')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className='text-sm font-medium text-slate-700 block mb-1'>
                {t('resource.share.link', 'Share Link')}
              </label>
              <div className='flex gap-2'>
                <InputField value={shareUrl} readOnly className='flex-1' />
                <Button onClick={handleCopyUrl}>{t('resource.share.copy', 'Copy')}</Button>
              </div>
            </div>
            <div className='flex justify-end'>
              <Button
                variant='outline-slate'
                onClick={() => {
                  setShareUrl(null);
                  onClose();
                }}
              >
                {t('actions.close', 'Close')}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
