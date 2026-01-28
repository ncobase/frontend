import React, { useCallback } from 'react';

import { FieldProps } from '../types';
import { UploaderProps, Uploader } from '../uploader';

import { Field } from './field';

export interface UploaderFieldProps
  extends FieldProps, Omit<UploaderProps, 'value' | 'onValueChange'> {
  returnType?: 'file' | 'url' | 'result';
  uploadOnChange?: boolean;
  onUploadSuccess?: (_result: any) => void;
  onUploadError?: (_error: any) => void;
  useUploadHook?: () => {
    uploadFile: (_file: File) => Promise<any>;
    uploading: boolean;
    progress: number;
    error: any;
    result: any;
  };
}

export const UploaderField = React.forwardRef<HTMLDivElement, UploaderFieldProps>(
  (
    {
      onChange,
      defaultValue,
      value,
      returnType = 'file',
      uploadOnChange = false,
      onUploadSuccess,
      onUploadError,
      useUploadHook,
      ...rest
    },
    ref
  ) => {
    const uploadHook = useUploadHook?.();
    const currentValue = value ?? defaultValue;

    const handleValueChange = useCallback(
      async (newValue: File | File[] | null) => {
        // If not uploading automatically, just pass the file(s) through
        if (!uploadOnChange || !uploadHook || !newValue) {
          onChange?.(newValue);
          return;
        }

        try {
          const filesToUpload = Array.isArray(newValue)
            ? newValue.filter((item): item is File => item instanceof File)
            : newValue instanceof File
              ? [newValue]
              : [];

          if (filesToUpload.length === 0) {
            onChange?.(newValue);
            return;
          }

          // Upload files
          const results = await Promise.all(filesToUpload.map(file => uploadHook.uploadFile(file)));

          onUploadSuccess?.(Array.isArray(newValue) ? results : results[0]);

          // Return appropriate value based on returnType
          switch (returnType) {
            case 'url':
              if (Array.isArray(newValue)) {
                const urls = results.map(
                  result => result.download_url || result.path || result.url
                );
                onChange?.(urls);
              } else {
                const url = results[0]?.download_url || results[0]?.path || results[0]?.url;
                onChange?.(url);
              }
              break;
            case 'result':
              onChange?.(Array.isArray(newValue) ? results : results[0]);
              break;
            default:
              // 'file' - keep original files
              onChange?.(newValue);
          }
        } catch (error) {
          console.error('Upload failed in UploaderField:', error);
          onUploadError?.(error);
          // Still pass through the files even if upload failed
          onChange?.(newValue);
        }
      },
      [onChange, uploadOnChange, uploadHook, returnType, onUploadSuccess, onUploadError]
    );

    // Upload function for auto-upload
    const uploadFunction = useCallback(
      async (file: File) => {
        if (uploadHook) {
          return uploadHook.uploadFile(file);
        }
        throw new Error('No upload function available');
      },
      [uploadHook]
    );

    return (
      <Field {...rest} ref={ref}>
        <Uploader
          value={currentValue}
          onValueChange={handleValueChange}
          autoUpload={uploadOnChange}
          uploadFunction={uploadOnChange ? uploadFunction : undefined}
          onUploadSuccess={onUploadSuccess}
          onUploadError={onUploadError}
          {...rest}
        />
      </Field>
    );
  }
);

UploaderField.displayName = 'UploaderField';

// Create a safe object URL
export const createSafeObjectURL = (file: File | Blob): string | null => {
  try {
    if (file instanceof File || file instanceof Blob) {
      return URL.createObjectURL(file);
    }
    return null;
  } catch (error) {
    console.error('Failed to create object URL:', error);
    return null;
  }
};

// Revoke a safe object URL
export const revokeSafeObjectURL = (url: string | null): void => {
  try {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Failed to revoke object URL:', error);
  }
};
