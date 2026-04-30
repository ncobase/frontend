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
      (newValue: File | File[] | null) => {
        if (!uploadOnChange || !uploadHook || !newValue) {
          onChange?.(newValue);
        }
      },
      [onChange, uploadOnChange, uploadHook]
    );

    const handleUploadComplete = useCallback(
      (result: any | any[], files: File[]) => {
        onUploadSuccess?.(result);
        const results = Array.isArray(result) ? result : [result];

        switch (returnType) {
          case 'url':
            onChange?.(
              Array.isArray(result)
                ? results.map(item => item.download_url || item.path || item.url)
                : results[0]?.download_url || results[0]?.path || results[0]?.url
            );
            break;
          case 'result':
            onChange?.(result);
            break;
          default:
            onChange?.(Array.isArray(result) ? files : files[0]);
        }
      },
      [onChange, onUploadSuccess, returnType]
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
          onUploadComplete={handleUploadComplete}
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
