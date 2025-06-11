import React from 'react';

import { Modal } from '@ncobase/react';
import { UploaderField } from '@ncobase/react';

import { useCreateMedia } from '../service';

interface MediaUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (_media: any) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

// Upload hook for media files
const useMediaUpload = () => {
  const createMediaMutation = useCreateMedia();

  const uploadFile = async (file: File) => {
    // Use resource plugin API for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('type', file.type);
    formData.append('owner_id', 'media'); // For media objects
    formData.append('space_id', 'current'); // Should come from context

    try {
      // Call resource API
      const response = await fetch('/api/res', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Create media record
      const mediaData = {
        title: file.name,
        type: file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('video/')
            ? 'video'
            : file.type.startsWith('audio/')
              ? 'audio'
              : 'file',
        url: result.download_url,
        path: result.path,
        mime_type: file.type,
        size: file.size,
        description: `Uploaded file: ${file.name}`
      };

      await createMediaMutation.mutateAsync(
        mediaData as {
          type: 'image' | 'video' | 'audio' | 'file';
          title: string;
          url: string;
          path: string;
          mime_type: string;
          size: number;
          description: string;
        }
      );

      return { ...result, ...mediaData };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  return {
    uploadFile,
    uploading: createMediaMutation.isPending,
    progress: 0, // Can be enhanced with actual progress
    error: null,
    result: null
  };
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
            onSuccess?.(result);
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
