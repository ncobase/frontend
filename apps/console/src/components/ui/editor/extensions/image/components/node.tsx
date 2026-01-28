import React, { useCallback, useRef, useState, memo } from 'react';

import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

import { useTranslation } from '@/components/ui/lib/i18n';
import { useToastMessage } from '@/components/ui/toast';

interface ImageNodeProps extends NodeViewProps {
  updateAttributes: (_attrs: Record<string, any>) => void;
  editor: any;
}

export const ImageNode = memo(({ node, updateAttributes, editor }: ImageNodeProps) => {
  const { src, alt, title, width, height, loading } = node.attrs;
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [progress, setProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFn = editor.options.imageUpload?.options?.uploadFn;

  const selectFile = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Validate file before upload
  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error(t('editor.imageUpload.error'), {
          description: t('editor.imageUpload.invalidType')
        });
        return false;
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(t('editor.imageUpload.error'), {
          description: t('editor.imageUpload.fileTooLarge')
        });
        return false;
      }

      return true;
    },
    [t, toast]
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target?.files?.[0];
      if (!file || !uploadFn) return;

      // Validate file before upload
      if (!validateFile(file)) return;

      try {
        // Set loading state
        updateAttributes({ loading: true });
        setProgress(0);

        // Create mock progress updates if uploadFn doesn't provide them
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + Math.random() * 10;
            return Math.min(newProgress, 95); // Cap at 95% until actual completion
          });
        }, 300);

        // Upload the file
        const url = await uploadFn(file);

        // Clear interval and set to 100%
        clearInterval(progressInterval);
        setProgress(100);

        // Update the node attributes with the new image URL
        updateAttributes({
          src: url,
          loading: false,
          alt: alt || file.name.split('.')[0] // Use filename as alt text if none exists
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(t('editor.imageUpload.error'), {
          description: t('editor.imageUpload.uploadError')
        });
        updateAttributes({ loading: false });
      }
    },
    [uploadFn, updateAttributes, validateFile, alt, t, toast]
  );

  const handleResize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height') => {
      const value = e.target.value ? `${e.target.value}px` : null;
      updateAttributes({ [dimension]: value });
    },
    [updateAttributes]
  );

  // Function to handle image error loading
  const handleImageError = useCallback(() => {
    toast.error(t('editor.imageUpload.error'), {
      description: t('editor.imageUpload.loadError')
    });
  }, [t, toast]);

  return (
    <NodeViewWrapper className='image-upload-component'>
      {src ? (
        <div className='image-container'>
          <img
            src={src}
            alt={alt || ''}
            title={title || ''}
            width={width}
            height={height}
            className={loading ? 'loading' : ''}
            onError={handleImageError}
          />
          {loading && (
            <div className='loading-overlay'>
              <div className='loading-progress'>
                <div className='progress-bar'>
                  <div className='progress-bar-fill' style={{ width: `${progress}%` }}></div>
                </div>
                <div className='progress-text'>{Math.round(progress)}%</div>
              </div>
            </div>
          )}

          <div className='image-controls mt-2 flex flex-wrap gap-2'>
            <input
              type='text'
              placeholder={t('editor.dialog.image.altText')}
              value={alt || ''}
              onChange={e => updateAttributes({ alt: e.target.value })}
              className='p-1 border border-border rounded'
              aria-label={t('editor.dialog.image.altText')}
            />

            <div className='flex items-center gap-1'>
              <span className='text-xs'>{t('editor.imageUpload.width')}</span>
              <input
                type='number'
                min='10'
                max='1000'
                value={width ? parseInt(width) : ''}
                onChange={e => handleResize(e, 'width')}
                className='w-16 p-1 border border-border rounded'
                aria-label={t('editor.imageUpload.width')}
              />
            </div>

            <div className='flex items-center gap-1'>
              <span className='text-xs'>{t('editor.imageUpload.height')}</span>
              <input
                type='number'
                min='10'
                max='1000'
                value={height ? parseInt(height) : ''}
                onChange={e => handleResize(e, 'height')}
                className='w-16 p-1 border border-border rounded'
                aria-label={t('editor.imageUpload.height')}
              />
            </div>

            <button
              onClick={() => updateAttributes({ width: null, height: null })}
              className='text-xs p-1 bg-secondary rounded-md'
              aria-label={t('editor.imageUpload.resetSize')}
            >
              {t('editor.imageUpload.resetSize')}
            </button>
          </div>
        </div>
      ) : (
        <div
          className='image-placeholder'
          onClick={selectFile}
          role='button'
          tabIndex={0}
          aria-label={t('editor.imageUpload.uploadAction')}
        >
          <div className='placeholder-content'>
            {loading ? (
              <div className='loading-progress'>
                <div className='progress-bar'>
                  <div className='progress-bar-fill' style={{ width: `${progress}%` }}></div>
                </div>
                <div className='progress-text'>{Math.round(progress)}%</div>
              </div>
            ) : (
              t('editor.imageUpload.uploadAction')
            )}
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            style={{ display: 'none' }}
            aria-hidden='true'
          />
        </div>
      )}
    </NodeViewWrapper>
  );
});
