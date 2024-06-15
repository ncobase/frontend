// uploader.tsx
import React from 'react';

import { Icons } from '../../icon';

import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
  FileUploaderProps
} from './elements';

interface UploadPlaceholderProps {
  mainText?: string;
  subText?: string;
  hint?: string;
}

export const DropPlaceholder: React.FC<UploadPlaceholderProps> = ({
  mainText = 'Browse file to upload',
  subText = 'or drag and drop',
  hint = 'SVG, PNG, JPG or GIF'
}) => {
  return (
    <div className='flex items-center justify-center flex-col pt-3 pb-4 w-full border border-gray-300 border-dashed rounded-lg cursor-pointer'>
      <Icons name='IconCloudUpload' className='w-12 h-12 mb-2 text-slate-400' stroke={1} />
      <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
        <span className='font-medium'>{mainText}</span>
        &nbsp; {subText}
      </p>
      <p className='text-xs text-gray-500 dark:text-gray-400'>{hint}</p>
    </div>
  );
};
export const Uploader: React.FC<FileUploaderProps> = ({
  value,
  onValueChange,
  dropzoneOptions,
  orientation,
  maxFiles,
  maxSize,
  accept
}) => {
  return (
    <FileUploader
      value={value}
      onValueChange={onValueChange}
      dropzoneOptions={dropzoneOptions}
      orientation={orientation}
      maxFiles={maxFiles}
      maxSize={maxSize}
      accept={accept}
    >
      <FileInput>
        <DropPlaceholder />
      </FileInput>
      <FileUploaderContent className='flex items-center flex-row gap-2'>
        {value?.map((file, i) => (
          <FileUploaderItem
            key={i}
            index={i}
            className='size-15 p-0 rounded-md overflow-hidden'
            aria-roledescription={`file ${i + 1} containing ${file.name}`}
          >
            {file?.type.includes('image') && (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                height={80}
                width={80}
                className='size-10 p-0'
              />
            )}
            {file?.type.includes('video') && (
              <video
                src={URL.createObjectURL(file)}
                height={80}
                width={80}
                className='size-10 p-0'
                controls
              >
                <track kind='captions' />
              </video>
            )}
            {!file?.type.includes('image') && !file?.type.includes('video') && (
              <div className='flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-400'>
                <Icons name='IconFile' className='w-6 h-6' stroke={1} />
              </div>
            )}
          </FileUploaderItem>
        ))}
      </FileUploaderContent>
    </FileUploader>
  );
};
