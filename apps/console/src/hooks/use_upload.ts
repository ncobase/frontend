import { useState, useCallback } from 'react';

import { useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

// Upload configuration type
export interface UploadConfig {
  objectId: string;
  tenantId?: string;
  folderPath?: string;
  accessLevel?: 'public' | 'private' | 'shared';
  isPublic?: boolean;
  tags?: string[];
  processingOptions?: {
    createThumbnail?: boolean;
    resizeImage?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    compressImage?: boolean;
    compressionQuality?: number;
    convertFormat?: string;
  };
  maxSize?: number;
  allowedTypes?: string[];
  endpoint?: string;
}

// Upload result type
export interface UploadResult {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  downloadUrl?: string;
  thumbnailUrl?: string;
  metadata?: any;
}

// Upload error type
export interface UploadError {
  code: string;
  message: string;
  details?: any;
}

// Upload state type
export interface UploadState {
  uploading: boolean;
  progress: number;
  error: UploadError | null;
  result: UploadResult | null;
}

// Default configurations
export const uploadConfigs = {
  // Tenant logo upload
  tenantLogo: (tenantId?: string): UploadConfig => ({
    objectId: tenantId ? `tenant-${tenantId}` : 'tenant',
    tenantId: tenantId || 'system',
    folderPath: 'logos/tenants',
    accessLevel: 'public',
    isPublic: true,
    tags: ['logo', 'tenant', 'branding'],
    processingOptions: {
      createThumbnail: true,
      resizeImage: true,
      maxWidth: 500,
      maxHeight: 500,
      compressImage: true,
      compressionQuality: 85
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/gif', 'image/webp']
  }),

  // User avatar upload
  userAvatar: (userId: string, tenantId?: string): UploadConfig => ({
    objectId: `user-${userId}`,
    tenantId: tenantId || 'system',
    folderPath: 'avatars/users',
    accessLevel: 'public',
    isPublic: true,
    tags: ['avatar', 'user', 'profile'],
    processingOptions: {
      createThumbnail: true,
      resizeImage: true,
      maxWidth: 300,
      maxHeight: 300,
      compressImage: true,
      compressionQuality: 80
    },
    maxSize: 1 * 1024 * 1024, // 1MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
  }),

  // Document upload
  document: (objectId: string, tenantId: string, isPublic = false): UploadConfig => ({
    objectId,
    tenantId,
    folderPath: 'documents',
    accessLevel: isPublic ? 'public' : 'private',
    isPublic,
    tags: ['document'],
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ]
  }),

  // Image upload
  image: (objectId: string, tenantId: string, options?: Partial<UploadConfig>): UploadConfig => ({
    objectId,
    tenantId,
    folderPath: 'images',
    accessLevel: 'private',
    isPublic: false,
    tags: ['image'],
    processingOptions: {
      createThumbnail: true,
      resizeImage: false,
      maxWidth: 1920,
      maxHeight: 1080,
      compressImage: true,
      compressionQuality: 90
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    ...options
  }),

  // File upload (general)
  file: (objectId: string, tenantId: string, options?: Partial<UploadConfig>): UploadConfig => ({
    objectId,
    tenantId,
    folderPath: 'files',
    accessLevel: 'private',
    isPublic: false,
    tags: ['file'],
    maxSize: 50 * 1024 * 1024, // 50MB
    ...options
  })
};

// Main upload hook
export const useUpload = (config?: UploadConfig) => {
  const { t } = useTranslation();
  const toast = useToastMessage();

  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    result: null
  });

  // Validate file before upload
  const validateFile = useCallback(
    (file: File, uploadConfig: UploadConfig): UploadError | null => {
      // Check file size
      if (uploadConfig.maxSize && file.size > uploadConfig.maxSize) {
        return {
          code: 'FILE_TOO_LARGE',
          message: t('upload.errors.file_too_large', {
            maxSize: formatFileSize(uploadConfig.maxSize),
            defaultValue: `File size must be less than ${formatFileSize(uploadConfig.maxSize)}`
          })
        };
      }

      // Check file type
      if (uploadConfig.allowedTypes && !uploadConfig.allowedTypes.includes(file.type)) {
        return {
          code: 'INVALID_FILE_TYPE',
          message: t('upload.errors.invalid_file_type', {
            allowedTypes: uploadConfig.allowedTypes.join(', '),
            defaultValue: `File type not allowed. Allowed types: ${uploadConfig.allowedTypes.join(', ')}`
          })
        };
      }

      return null;
    },
    [t]
  );

  // Build form data for upload
  const buildFormData = useCallback((file: File, uploadConfig: UploadConfig): FormData => {
    const formData = new FormData();

    // Add file
    formData.append('file', file);

    // Add required parameters
    formData.append('object_id', uploadConfig.objectId);

    if (uploadConfig.tenantId) {
      formData.append('tenant_id', uploadConfig.tenantId);
    }

    if (uploadConfig.folderPath) {
      formData.append('folder_path', uploadConfig.folderPath);
    }

    if (uploadConfig.accessLevel) {
      formData.append('access_level', uploadConfig.accessLevel);
    }

    if (uploadConfig.isPublic !== undefined) {
      formData.append('is_public', uploadConfig.isPublic.toString());
    }

    if (uploadConfig.tags && uploadConfig.tags.length > 0) {
      formData.append('tags', uploadConfig.tags.join(','));
    }

    if (uploadConfig.processingOptions) {
      formData.append('processing_options', JSON.stringify(uploadConfig.processingOptions));
    }

    return formData;
  }, []);

  // Upload single file
  const uploadFile = useCallback(
    async (file: File, uploadConfig?: UploadConfig): Promise<UploadResult> => {
      const finalConfig = uploadConfig || config;

      if (!finalConfig) {
        throw new Error('Upload configuration is required');
      }

      // Reset state
      setState({
        uploading: true,
        progress: 0,
        error: null,
        result: null
      });

      try {
        // Validate file
        const validationError = validateFile(file, finalConfig);
        if (validationError) {
          setState(prev => ({ ...prev, error: validationError, uploading: false }));
          throw new Error(validationError.message);
        }

        // Build form data
        const formData = buildFormData(file, finalConfig);

        // Create XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest();

        const uploadPromise = new Promise<UploadResult>((resolve, reject) => {
          xhr.upload.addEventListener('progress', event => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setState(prev => ({ ...prev, progress }));
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const result = JSON.parse(xhr.responseText) as UploadResult;
                setState(prev => ({
                  ...prev,
                  uploading: false,
                  progress: 100,
                  result
                }));
                resolve(result);
                // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
              } catch (error) {
                const parseError: UploadError = {
                  code: 'PARSE_ERROR',
                  message: t('upload.errors.parse_error', 'Failed to parse response')
                };
                setState(prev => ({ ...prev, error: parseError, uploading: false }));
                reject(new Error(parseError.message));
              }
            } else {
              try {
                const errorResponse = JSON.parse(xhr.responseText);
                const uploadError: UploadError = {
                  code: errorResponse.code || 'UPLOAD_FAILED',
                  message:
                    errorResponse.message || t('upload.errors.upload_failed', 'Upload failed')
                };
                setState(prev => ({ ...prev, error: uploadError, uploading: false }));
                reject(new Error(uploadError.message));
              } catch {
                const uploadError: UploadError = {
                  code: 'UPLOAD_FAILED',
                  message: t('upload.errors.upload_failed', 'Upload failed')
                };
                setState(prev => ({ ...prev, error: uploadError, uploading: false }));
                reject(new Error(uploadError.message));
              }
            }
          });

          xhr.addEventListener('error', () => {
            const networkError: UploadError = {
              code: 'NETWORK_ERROR',
              message: t('upload.errors.network_error', 'Network error occurred')
            };
            setState(prev => ({ ...prev, error: networkError, uploading: false }));
            reject(new Error(networkError.message));
          });

          xhr.addEventListener('timeout', () => {
            const timeoutError: UploadError = {
              code: 'TIMEOUT_ERROR',
              message: t('upload.errors.timeout_error', 'Upload timeout')
            };
            setState(prev => ({ ...prev, error: timeoutError, uploading: false }));
            reject(new Error(timeoutError.message));
          });

          // Open request
          xhr.open('POST', finalConfig.endpoint || '/api/res');

          // Set timeout (30 seconds)
          xhr.timeout = 30000;

          // Send request
          xhr.send(formData);
        });

        const result = await uploadPromise;

        // Show success toast
        toast.success(t('upload.success', 'File uploaded successfully'), {
          description: t(
            'upload.success_description',
            'Your file has been uploaded and is ready to use.'
          )
        });

        return result;
      } catch (error) {
        // Show error toast
        toast.error(t('upload.error', 'Upload failed'), {
          description:
            error instanceof Error
              ? error.message
              : t('upload.unknown_error', 'An unknown error occurred')
        });

        throw error;
      }
    },
    [config, validateFile, buildFormData, t, toast]
  );

  // Upload multiple files
  const uploadFiles = useCallback(
    async (files: File[], uploadConfig?: UploadConfig): Promise<UploadResult[]> => {
      const results: UploadResult[] = [];
      const errors: UploadError[] = [];

      for (const file of files) {
        try {
          const result = await uploadFile(file, uploadConfig);
          results.push(result);
        } catch (error) {
          errors.push({
            code: 'UPLOAD_FAILED',
            message: error instanceof Error ? error.message : 'Unknown error',
            details: { fileName: file.name }
          });
        }
      }

      if (errors.length > 0) {
        // Show summary toast for multiple files
        toast.warning(t('upload.partial_success', 'Some files failed to upload'), {
          description: t('upload.partial_success_description', {
            success: results.length,
            total: files.length,
            defaultValue: `${results.length} of ${files.length} files uploaded successfully`
          })
        });
      }

      return results;
    },
    [uploadFile, t, toast]
  );

  // Reset upload state
  const reset = useCallback(() => {
    setState({
      uploading: false,
      progress: 0,
      error: null,
      result: null
    });
  }, []);

  return {
    ...state,
    uploadFile,
    uploadFiles,
    reset,
    validateFile: (file: File, uploadConfig?: UploadConfig) =>
      validateFile(file, uploadConfig || config!)
  };
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Tenant logo upload hook
export const useTenantLogoUpload = (tenantId?: string) => {
  return useUpload(uploadConfigs.tenantLogo(tenantId));
};

// Avatar upload hook
export const useAvatarUpload = (userId: string, tenantId?: string) => {
  return useUpload(uploadConfigs.userAvatar(userId, tenantId));
};

// Document upload hook
export const useDocumentUpload = (objectId: string, tenantId: string, isPublic = false) => {
  return useUpload(uploadConfigs.document(objectId, tenantId, isPublic));
};

// Image upload hook
export const useImageUpload = (
  objectId: string,
  tenantId: string,
  options?: Partial<UploadConfig>
) => {
  return useUpload(uploadConfigs.image(objectId, tenantId, options));
};

// File upload hook
export const useFileUpload = (
  objectId: string,
  tenantId: string,
  options?: Partial<UploadConfig>
) => {
  return useUpload(uploadConfigs.file(objectId, tenantId, options));
};

// Uploader integration hook
export interface UploaderIntegrationConfig {
  objectId: string;
  tenantId?: string;
  folderPath?: string;
  autoUpload?: boolean;
  returnType?: 'file' | 'url' | 'result';
  onSuccess?: (_result: any) => void;
  onError?: (_error: Error) => void;
}

// Uploader integration hook
export const useUploaderIntegration = (uploadHook: any, config: UploaderIntegrationConfig) => {
  const handleUpload = useCallback(
    async (file: File) => {
      try {
        const result = await uploadHook.uploadFile(file);
        config.onSuccess?.(result);

        switch (config.returnType) {
          case 'url':
            return result.downloadUrl || result.path;
          case 'result':
            return result;
          default:
            return file;
        }
      } catch (error) {
        config.onError?.(error as Error);
        throw error;
      }
    },
    [uploadHook, config]
  );

  return {
    uploadFunction: handleUpload,
    uploading: uploadHook.uploading,
    progress: uploadHook.progress,
    error: uploadHook.error,
    result: uploadHook.result,
    autoUpload: config.autoUpload ?? false
  };
};
