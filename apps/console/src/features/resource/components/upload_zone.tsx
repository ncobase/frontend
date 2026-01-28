import { useCallback, useRef, useState } from 'react';

import { Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

interface UploadZoneProps {
  onFiles: (_files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
}

export const UploadZone = ({
  onFiles,
  accept,
  multiple = true,
  maxSize,
  disabled
}: UploadZoneProps) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (fileList: FileList) => {
      const files = Array.from(fileList);
      const filtered = maxSize ? files.filter(f => f.size <= maxSize) : files;
      if (filtered.length > 0) {
        onFiles(filtered);
      }
    },
    [onFiles, maxSize]
  );

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
      if (e.dataTransfer.files?.length) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        disabled
          ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
          : dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400 cursor-pointer'
      }`}
      onDragEnter={disabled ? undefined : handleDrag}
      onDragLeave={disabled ? undefined : handleDrag}
      onDragOver={disabled ? undefined : handleDrag}
      onDrop={disabled ? undefined : handleDrop}
      onClick={disabled ? undefined : () => inputRef.current?.click()}
    >
      <Icons name='IconCloudUpload' className='w-12 h-12 mx-auto text-slate-400 mb-3' />
      <p className='text-sm text-slate-600 mb-1'>
        {t('resource.upload.drag_drop', 'Drag and drop files here')}
      </p>
      <p className='text-xs text-slate-400 mb-3'>
        {t('resource.upload.or_click', 'or click to browse')}
      </p>
      {maxSize && (
        <p className='text-xs text-slate-400'>
          {t('resource.upload.max_size', 'Max file size')}: {Math.round(maxSize / 1024 / 1024)}MB
        </p>
      )}
      <input
        ref={inputRef}
        type='file'
        multiple={multiple}
        accept={accept}
        className='hidden'
        disabled={disabled}
        onChange={e => {
          if (e.target.files?.length) {
            processFiles(e.target.files);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};
