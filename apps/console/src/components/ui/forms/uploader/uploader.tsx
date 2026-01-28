import React, { useCallback, useState, useEffect } from 'react';

import { cn } from '@ncobase/utils';

import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  type FileUploaderProps
} from './elements';

import { Icons } from '@/components/ui/icon';

interface DropPlaceholderProps {
  text?: {
    main?: string;
    sub?: string;
    hint?: string;
  };
}

const DropPlaceholder: React.FC<DropPlaceholderProps> = ({
  text = {
    main: 'Browse file to upload',
    sub: 'or drag and drop',
    hint: 'SVG, PNG, JPG or GIF'
  }
}) => {
  return (
    <div className='flex items-center justify-center flex-col pt-3 pb-4 w-full bg-slate-50/55 hover:bg-slate-50/25 border border-slate-200/65 shadow-[0.03125rem_0.03125rem_0.125rem_0_rgba(0,0,0,0.03)] rounded-md cursor-pointer'>
      <Icons name='IconCloudUpload' className='w-12 h-12 mb-2 text-slate-400' stroke={1} />
      <p className='mb-1 text-gray-500 dark:text-gray-400'>
        <span className='font-medium'>{text.main}</span>
        &nbsp; {text.sub}
      </p>
      {text.hint && <span className='text-xs text-gray-500 dark:text-gray-400'>{text.hint}</span>}
    </div>
  );
};

const SingleFileDropPlaceholder: React.FC<DropPlaceholderProps> = ({
  text = {
    main: 'Click to upload',
    sub: 'or drag and drop'
  }
}) => {
  return (
    <div className='flex items-center justify-start w-full bg-slate-50/55 hover:bg-slate-50/25 border border-slate-200/65 shadow-[0.03125rem_0.03125rem_0.125rem_0_rgba(0,0,0,0.03)] rounded-md cursor-pointer px-3 py-2'>
      <Icons name='IconCloudUpload' className='w-5 h-5 mr-2 text-slate-400' stroke={1} />
      <div>
        <p className='text-gray-500 dark:text-gray-400'>
          <span className='font-medium'>{text.main}</span>
          &nbsp; {text.sub}
          {text.hint && (
            <span className='text-xs text-gray-500 dark:text-gray-400'>&nbsp;{text.hint}</span>
          )}
        </p>
      </div>
    </div>
  );
};

// Upload status component
const UploadStatus: React.FC<{
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress?: number;
  fileName?: string;
  error?: string;
  result?: any;
  onDismiss?: () => void;
  showDetails?: boolean;
}> = ({ status, progress = 0, fileName, error, result, onDismiss, showDetails = false }) => {
  if (status === 'idle') return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Icons name='IconLoader2' className='w-4 h-4 animate-spin text-blue-500' />;
      case 'success':
        return <Icons name='IconCheck' className='w-4 h-4 text-green-500' />;
      case 'error':
        return <Icons name='IconX' className='w-4 h-4 text-red-500' />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={cn('mt-2 p-3 rounded-md border', getBgColor())}>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center space-x-2 flex-1 min-w-0'>
          {getStatusIcon()}
          <span className='text-sm text-gray-700 truncate'>
            {fileName || (status === 'uploading' ? 'Uploading...' : 'File')}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          {status === 'uploading' && <span className='text-xs text-gray-500'>{progress}%</span>}
          {(status === 'success' || status === 'error') && onDismiss && (
            <button
              onClick={onDismiss}
              className='text-gray-400 hover:text-gray-600 transition-colors'
              title='Dismiss'
            >
              <Icons name='IconX' className='w-4 h-4' />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar for uploading */}
      {status === 'uploading' && (
        <div className='w-full bg-gray-200 rounded-full h-1.5'>
          <div
            className={cn('h-1.5 rounded-full transition-all duration-300', getProgressColor())}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error message */}
      {status === 'error' && error && <div className='text-xs text-red-600 mt-1'>{error}</div>}

      {/* Success details */}
      {status === 'success' && result && (
        <div className='space-y-1'>
          <div className='text-xs text-green-600'>
            <span className='font-medium'>File:</span> {result.name || 'Unknown'}
          </div>
          {result.size && (
            <div className='text-xs text-green-600'>
              <span className='font-medium'>Size:</span> {(result.size / 1024).toFixed(1)} KB
            </div>
          )}
          {result.download_url && (
            <div className='text-xs'>
              <a
                href={result.download_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-800 underline hover:no-underline'
              >
                View uploaded file
              </a>
            </div>
          )}
          {showDetails && result.id && (
            <div className='text-xs text-green-600'>
              <span className='font-medium'>ID:</span> {result.id}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Uploader interface
export interface UploaderProps extends FileUploaderProps {
  placeholderText?: DropPlaceholderProps['text'];
  renderCustomFileItem?: (_file: File, _index: number) => React.ReactNode;
  className?: string;

  // Upload functionality
  autoUpload?: boolean;
  uploadFunction?: (_file: File) => Promise<any>;

  // UI configuration
  showProgress?: boolean;
  showResult?: boolean;
  showResultDetails?: boolean;
  resultDisplayTime?: number;

  // Validation
  validateFile?: (_file: File) => string | null;

  // Callbacks
  onUploadStart?: (_file: File) => void;
  onUploadProgress?: (_progress: number, _file: File) => void;
  onUploadSuccess?: (_result: any, _file: File) => void;
  onUploadError?: (_error: Error, _file: File) => void;
}

export const Uploader: React.FC<UploaderProps> = ({
  value,
  onValueChange,
  dropzoneOptions,
  orientation,
  maxFiles = 1,
  maxSize,
  accept,
  placeholderText,
  renderCustomFileItem,
  className,
  autoUpload = false,
  uploadFunction,
  showProgress = true,
  showResult = true,
  showResultDetails = false,
  resultDisplayTime = 3000,
  validateFile,
  onUploadStart,
  onUploadProgress,
  onUploadSuccess,
  onUploadError,
  ...props
}) => {
  const isSingleFile = maxFiles === 1;

  // Upload state
  const [uploadState, setUploadState] = useState<{
    status: 'idle' | 'uploading' | 'success' | 'error';
    progress: number;
    error: string | null;
    result: any;
    fileName: string | null;
  }>({
    status: 'idle',
    progress: 0,
    error: null,
    result: null,
    fileName: null
  });

  // Auto-hide success result
  useEffect(() => {
    if (uploadState.status === 'success' && resultDisplayTime > 0) {
      const timer = setTimeout(() => {
        setUploadState(prev => ({ ...prev, status: 'idle', result: null }));
      }, resultDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [uploadState.status, resultDisplayTime]);

  const handleRemove = useCallback(
    (index: number) => {
      if (isSingleFile) {
        onValueChange?.(null);
      } else if (Array.isArray(value)) {
        const newFiles = value.filter((_, i) => i !== index);
        onValueChange?.(newFiles.length > 0 ? newFiles : null);
      }
      // Reset upload state when removing files
      setUploadState({
        status: 'idle',
        progress: 0,
        error: null,
        result: null,
        fileName: null
      });
    },
    [isSingleFile, value, onValueChange]
  );

  const validateFileBeforeUpload = useCallback(
    (file: File): string | null => {
      // Built-in validation
      if (maxSize && file.size > maxSize) {
        return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
      }
      // Custom validation
      return validateFile?.(file) || null;
    },
    [maxSize, validateFile]
  );

  const handleUpload = useCallback(
    async (file: File) => {
      if (!uploadFunction) return;

      // Validate file
      const validationError = validateFileBeforeUpload(file);
      if (validationError) {
        setUploadState({
          status: 'error',
          progress: 0,
          error: validationError,
          result: null,
          fileName: file.name
        });
        onUploadError?.(new Error(validationError), file);
        return;
      }

      try {
        setUploadState({
          status: 'uploading',
          progress: 0,
          error: null,
          result: null,
          fileName: file.name
        });

        onUploadStart?.(file);

        // Simple progress simulation
        const progressInterval = setInterval(() => {
          setUploadState(prev => {
            if (prev.status !== 'uploading') return prev;
            const newProgress = Math.min(prev.progress + Math.random() * 20, 90);
            onUploadProgress?.(newProgress, file);
            return { ...prev, progress: newProgress };
          });
        }, 200);

        const result = await uploadFunction(file);

        clearInterval(progressInterval);

        setUploadState({
          status: 'success',
          progress: 100,
          error: null,
          result,
          fileName: file.name
        });

        onUploadSuccess?.(result, file);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadState({
          status: 'error',
          progress: 0,
          error: errorMessage,
          result: null,
          fileName: file.name
        });
        onUploadError?.(error instanceof Error ? error : new Error('Upload failed'), file);
      }
    },
    [
      uploadFunction,
      validateFileBeforeUpload,
      onUploadStart,
      onUploadProgress,
      onUploadSuccess,
      onUploadError
    ]
  );

  const handleValueChange = useCallback(
    async (newValue: File | File[] | null) => {
      onValueChange?.(newValue);

      if (autoUpload && uploadFunction && newValue) {
        const fileToUpload = Array.isArray(newValue)
          ? newValue.find((item): item is File => item instanceof File)
          : newValue instanceof File
            ? newValue
            : null;

        if (fileToUpload) {
          await handleUpload(fileToUpload);
        }
      }
    },
    [onValueChange, autoUpload, uploadFunction, handleUpload]
  );

  const renderFileItems = useCallback(() => {
    if (!value) return [];
    const files = Array.isArray(value) ? value : [value];
    return files.map((file, i) =>
      renderCustomFileItem ? (
        renderCustomFileItem(file instanceof File ? file : new File([], 'unknown'), i)
      ) : (
        <FileUploaderItem
          key={i}
          index={i}
          file={file}
          onRemove={handleRemove}
          isSingleFile={isSingleFile}
          className={cn('rounded-md overflow-hidden', isSingleFile ? 'w-full' : 'w-24 h-24')}
          aria-roledescription={`file ${i + 1}`}
        />
      )
    );
  }, [value, renderCustomFileItem, handleRemove, isSingleFile]);

  const dismissStatus = useCallback(() => {
    setUploadState(prev => ({ ...prev, status: 'idle', error: null, result: null }));
  }, []);

  return (
    <div className='space-y-2'>
      <FileUploader
        value={value}
        onValueChange={handleValueChange}
        dropzoneOptions={dropzoneOptions}
        orientation={orientation}
        maxFiles={maxFiles}
        maxSize={maxSize}
        accept={accept}
        disabled={uploadState.status === 'uploading'}
        className={cn('focus:outline-hidden focus:ring-0', className)}
        {...props}
      >
        <FileInput className='focus:outline-hidden focus:ring-0'>
          {(!value || Array.isArray(value)) &&
            (isSingleFile ? (
              <SingleFileDropPlaceholder text={placeholderText} />
            ) : (
              <DropPlaceholder text={placeholderText} />
            ))}
        </FileInput>

        <FileUploaderContent
          className={cn(
            'flex items-center gap-2',
            isSingleFile ? 'flex-col' : 'flex-row flex-wrap'
          )}
        >
          {renderFileItems()}
        </FileUploaderContent>
      </FileUploader>

      {/* Upload Status */}
      {(showProgress || showResult) && (
        <UploadStatus
          status={uploadState.status}
          progress={uploadState.progress}
          fileName={uploadState.fileName}
          error={uploadState.error}
          result={uploadState.result}
          showDetails={showResultDetails}
          onDismiss={dismissStatus}
        />
      )}
    </div>
  );
};
