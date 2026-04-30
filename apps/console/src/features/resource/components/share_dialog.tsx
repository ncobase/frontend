import { useEffect, useMemo, useState } from 'react';

import {
  Badge,
  Button,
  Icons,
  Modal,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToastMessage
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { ResourceAccessLevel, ResourceFile, ShareLink } from '../resource';
import { useShareFile } from '../service';

interface ShareDialogProps {
  isOpen: boolean;
  file: ResourceFile | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const toAbsoluteUrl = (url?: string) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`;
};

const formatExpiration = (expiresAt?: number | string) => {
  if (!expiresAt) return '';
  const date = typeof expiresAt === 'number' ? new Date(expiresAt) : new Date(expiresAt);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
};

export const ShareDialog = ({ isOpen, file, onClose, onSuccess }: ShareDialogProps) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [accessLevel, setAccessLevel] = useState<ResourceAccessLevel>('shared');
  const [expirationHours, setExpirationHours] = useState(24);
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const shareMutation = useShareFile();

  useEffect(() => {
    if (!isOpen) {
      setShareLink(null);
      setAccessLevel('shared');
      setExpirationHours(24);
    }
  }, [isOpen]);

  const shareUrl = useMemo(() => toAbsoluteUrl(shareLink?.url), [shareLink]);
  const expiresAt = useMemo(() => formatExpiration(shareLink?.expires_at), [shareLink]);

  if (!file) return null;

  const handleShare = () => {
    shareMutation.mutate(
      {
        id: file.id,
        access_level: accessLevel,
        expiration_hours: Math.max(1, expirationHours || 24)
      },
      {
        onSuccess: data => {
          setShareLink(data);
          onSuccess?.();
          toast.success(t('messages.success'), {
            description: t('resource.share.generated', 'Share link generated')
          });
        },
        onError: (error: any) => {
          toast.error(t('messages.error'), {
            description: error?.message || t('messages.unknown_error')
          });
        }
      }
    );
  };

  const handleCopyUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    toast.success(t('messages.success'), {
      description: t('resource.share.copied', 'Link copied')
    });
  };

  const handleClose = () => {
    if (shareMutation.isPending) return;
    setShareLink(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onCancel={handleClose}
      title={t('resource.share.title', 'Share File')}
      className='max-w-lg'
    >
      <div className='space-y-5'>
        <div className='rounded-lg border border-slate-200 p-4'>
          <div className='flex items-start gap-3'>
            <Icons name='IconFile' className='mt-0.5 text-slate-400' />
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium text-slate-800'>
                {file.original_name || file.name}
              </p>
              <div className='mt-2 flex flex-wrap items-center gap-2'>
                <Badge variant={file.access_level === 'public' ? 'success' : 'secondary'} size='xs'>
                  {t(`resource.access.${file.access_level || 'private'}`, file.access_level)}
                </Badge>
                {file.is_public && (
                  <Badge variant='success' size='xs'>
                    {t('resource.access.public', 'Public')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {!shareLink ? (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-slate-700'>
                  {t('resource.share.access_level', 'Access level')}
                </label>
                <Select
                  value={accessLevel}
                  onValueChange={(value: ResourceAccessLevel) => setAccessLevel(value)}
                >
                  <SelectTrigger className='w-full bg-white border-slate-200'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-white border-slate-200'>
                    <SelectItem value='shared'>{t('resource.access.shared', 'Shared')}</SelectItem>
                    <SelectItem value='public'>{t('resource.access.public', 'Public')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-slate-700'>
                  {t('resource.share.expiration_hours', 'Expiration hours')}
                </label>
                <input
                  type='number'
                  min={1}
                  max={8760}
                  value={expirationHours}
                  onChange={e => setExpirationHours(Number(e.target.value) || 24)}
                  className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                />
              </div>
            </div>

            <div className='rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500'>
              {accessLevel === 'public'
                ? t(
                    'resource.share.public_note',
                    'Public sharing allows direct download until the configured expiration time.'
                  )
                : t(
                    'resource.share.shared_note',
                    'Shared links use a token and do not expose the file as a public resource.'
                  )}
            </div>

            <div className='flex justify-end gap-2'>
              <Button
                variant='outline-slate'
                onClick={handleClose}
                disabled={shareMutation.isPending}
              >
                {t('actions.cancel', 'Cancel')}
              </Button>
              <Button
                onClick={handleShare}
                isLoading={shareMutation.isPending}
                startIcon={<Icons name='IconLink' />}
              >
                {t('resource.share.generate', 'Generate Link')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-slate-700'>
                {t('resource.share.link', 'Share link')}
              </label>
              <div className='flex gap-2'>
                <input
                  value={shareUrl}
                  readOnly
                  className='min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none'
                />
                <Button onClick={handleCopyUrl} startIcon={<Icons name='IconCopy' />}>
                  {t('resource.share.copy', 'Copy')}
                </Button>
              </div>
            </div>

            {expiresAt && (
              <div className='rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-600'>
                {t('resource.share.expires_at', 'Expires at')}: {expiresAt}
              </div>
            )}

            <div className='flex justify-end'>
              <Button variant='outline-slate' onClick={handleClose}>
                {t('actions.close', 'Close')}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
