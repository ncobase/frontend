import { useCallback, useState } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

interface UploadFormProps {
  onUpload: (files: FileList) => void;
  uploading?: boolean;
}

export const UploadForm = ({ onUpload, uploading }: UploadFormProps) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onUpload(e.dataTransfer.files);
      }
    },
    [onUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onUpload(e.target.files);
      }
    },
    [onUpload]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Icons name='IconCloudUpload' className='w-12 h-12 mx-auto text-slate-400 mb-4' />
      <p className='text-slate-600 mb-2'>
        {t('resource.upload.drag_drop', 'Drag and drop files here')}
      </p>
      <p className='text-slate-400 text-sm mb-4'>{t('resource.upload.or', 'or')}</p>
      <label className='cursor-pointer'>
        <Button disabled={uploading} onClick={() => {}}>
          {uploading
            ? t('resource.upload.uploading', 'Uploading...')
            : t('resource.upload.browse', 'Browse Files')}
        </Button>
        <input
          type='file'
          multiple
          className='hidden'
          onChange={handleFileInput}
          disabled={uploading}
        />
      </label>
    </div>
  );
};
