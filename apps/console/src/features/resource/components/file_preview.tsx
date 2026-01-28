import { Icons, Modal } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { ResourceFile } from '../resource';

interface FilePreviewProps {
  isOpen: boolean;
  file: ResourceFile | null;
  onClose: () => void;
}

export const FilePreview = ({ isOpen, file, onClose }: FilePreviewProps) => {
  const { t } = useTranslation();

  if (!file) return null;

  const renderPreview = () => {
    switch (file.category) {
      case 'image':
        return file.download_url ? (
          <img
            src={file.download_url}
            alt={file.name}
            className='max-w-full max-h-[60vh] object-contain mx-auto'
          />
        ) : (
          <div className='flex items-center justify-center h-64 bg-slate-50'>
            <Icons name='IconPhoto' className='w-16 h-16 text-slate-300' />
          </div>
        );
      case 'video':
        return file.download_url ? (
          <video controls className='max-w-full max-h-[60vh] mx-auto'>
            <source src={file.download_url} type={file.type} />
          </video>
        ) : (
          <div className='flex items-center justify-center h-64 bg-slate-50'>
            <Icons name='IconVideo' className='w-16 h-16 text-slate-300' />
          </div>
        );
      case 'audio':
        return file.download_url ? (
          <div className='p-8'>
            <audio controls className='w-full'>
              <source src={file.download_url} type={file.type} />
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
          {file.download_url && (
            <a
              href={file.download_url}
              download={file.original_name || file.name}
              className='text-blue-500 hover:text-blue-600 flex items-center gap-1'
            >
              <Icons name='IconDownload' className='w-4 h-4' />
              {t('resource.actions.download', 'Download')}
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};
