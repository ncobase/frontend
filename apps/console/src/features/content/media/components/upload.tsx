import React from 'react';

import { Modal } from '@ncobase/react';
import { UploaderField } from '@ncobase/react';

import type { Media } from '../media';
import { useMediaResourceUpload } from '../media_resource';

interface MediaUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (_media: Media | Media[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

// Upload hook for media files
const useMediaUpload = () => {
  return useMediaResourceUpload({
    source: 'media',
    pathPrefix: 'content/media',
    tags: ['library']
  });
};

export const MediaUpload: React.FC<MediaUploadProps> = ({
  isOpen,
  onClose,
  onSuccess,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    'video/*': ['.mp4', '.webm', '.ogg'],
    'audio/*': ['.mp3', '.wav', '.ogg'],
    'application/*': ['.pdf', '.doc', '.docx']
  },
  maxSize = 10 * 1024 * 1024 // 10MB
}) => {
  return (
    <Modal isOpen={isOpen} title='Upload Media' onCancel={onClose} size='xs'>
      <div className='space-y-4'>
        <p className='text-sm text-gray-600'>Upload images, videos, audio files, or documents</p>

        <UploaderField
          accept={accept}
          maxSize={maxSize}
          maxFiles={5}
          uploadOnChange={true}
          returnType='result'
          useUploadHook={useMediaUpload}
          onUploadSuccess={result => {
            const mediaResult = Array.isArray(result)
              ? result.map(item => item.media || item)
              : result?.media || result;
            onSuccess?.(mediaResult);
            onClose();
          }}
          placeholderText={{
            main: 'Click to upload media files',
            sub: 'or drag and drop',
            hint: 'Images, Videos, Audio, Documents (max 10MB each)'
          }}
        />
      </div>
    </Modal>
  );
};
