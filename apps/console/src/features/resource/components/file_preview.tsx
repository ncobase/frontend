import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Icons, Modal, useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { download } from '../apis';
import { getResourceFileName, saveBlob } from '../file_actions';
import { ResourceFile } from '../resource';

interface FilePreviewProps {
  isOpen: boolean;
  file: ResourceFile | null;
  onClose: () => void;
}

export const FilePreview = ({ isOpen, file, onClose }: FilePreviewProps) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [protectedUrl, setProtectedUrl] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const previewable = useMemo(
    () => !!file && ['image', 'video', 'audio'].includes(file.category || ''),
    [file]
  );
  const previewUrl = file?.download_url || protectedUrl;

  useEffect(() => {
    if (!isOpen || !file || file.download_url || !previewable) {
      setProtectedUrl('');
      setPreviewLoading(false);
      return;
    }

    let active = true;
    let objectUrl = '';
    setPreviewLoading(true);

    download(file.id)
      .then(blob => {
        objectUrl = URL.createObjectURL(blob);
        if (active) {
          setProtectedUrl(objectUrl);
        }
      })
      .catch(() => {
        if (active) {
          toast.error(t('messages.error'), {
            description: t('resource.preview.load_failed', 'Failed to load preview')
          });
        }
      })
      .finally(() => {
        if (active) {
          setPreviewLoading(false);
        }
      });

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file, isOpen, previewable, t, toast]);

  const handleProtectedDownload = useCallback(async () => {
    if (!file) return;
    setDownloadLoading(true);
    try {
      const blob = await download(file.id);
      saveBlob(blob, getResourceFileName(file));
    } catch (error: any) {
      toast.error(t('messages.error'), {
        description: error?.message || t('messages.unknown_error')
      });
    } finally {
      setDownloadLoading(false);
    }
  }, [file, t, toast]);

  if (!file) return null;

  const renderPreview = () => {
    if (previewLoading) {
      return (
        <div className='flex items-center justify-center h-64 bg-slate-50 text-sm text-slate-400'>
          {t('common.loading', 'Loading...')}
        </div>
      );
    }

    switch (file.category) {
      case 'image':
        return previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            className='max-w-full max-h-[60vh] object-contain mx-auto'
          />
        ) : (
          <div className='flex items-center justify-center h-64 bg-slate-50'>
            <Icons name='IconPhoto' className='w-16 h-16 text-slate-300' />
          </div>
        );
      case 'video':
        return previewUrl ? (
          <video controls className='max-w-full max-h-[60vh] mx-auto'>
            <source src={previewUrl} type={file.type} />
          </video>
        ) : (
          <div className='flex items-center justify-center h-64 bg-slate-50'>
            <Icons name='IconVideo' className='w-16 h-16 text-slate-300' />
          </div>
        );
      case 'audio':
        return previewUrl ? (
          <div className='p-8'>
            <audio controls className='w-full'>
              <source src={previewUrl} type={file.type} />
            </audio>
          </div>
        ) : null;
      default:
        return (
          <div className='flex flex-col items-center justify-center h-64 bg-slate-50'>
            <Icons name='IconFile' className='w-16 h-16 text-slate-300 mb-4' />
            <p className='text-sm text-slate-500'>
              {t('resource.preview.not_available', 'Preview not available for this file type')}
            </p>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onCancel={onClose}
      title={file.original_name || file.name}
      className='max-w-4xl'
    >
      <div className='p-4'>
        {renderPreview()}
        <div className='mt-4 flex items-center justify-between text-sm text-slate-500'>
          <span>{file.type}</span>
          {file.download_url ? (
            <a
              href={file.download_url}
              download={file.original_name || file.name}
              className='text-blue-500 hover:text-blue-600 flex items-center gap-1'
            >
              <Icons name='IconDownload' className='w-4 h-4' />
              {t('resource.actions.download', 'Download')}
            </a>
          ) : (
            <Button
              variant='outline-slate'
              size='sm'
              onClick={handleProtectedDownload}
              isLoading={downloadLoading}
              startIcon={<Icons name='IconDownload' />}
            >
              {t('resource.actions.download', 'Download')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
