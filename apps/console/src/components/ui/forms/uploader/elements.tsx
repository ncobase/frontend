import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { cn } from '@ncobase/utils';
import type { Accept, DropzoneOptions, DropzoneState, FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/ui/icon';

type DirectionOptions = 'rtl' | 'ltr' | undefined;

type FileUploaderContextType = {
  dropzoneState: DropzoneState;
  isLOF: boolean;
  isFileTooBig: boolean;
  // eslint-disable-next-line no-unused-vars
  removeFileFromSet: (index: number) => void;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  orientation: 'horizontal' | 'vertical';
  direction: DirectionOptions;
  isSingleFile: boolean;
};

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error('useFileUpload must be used within a FileUploaderProvider');
  }
  return context;
};

// File Uploader types
export type FileUploaderProps = {
  value?: File | File[];
  onValueChange?: (_value?: File | File[]) => void;
  dropzoneOptions?: DropzoneOptions;
  orientation?: 'horizontal' | 'vertical';
  maxFiles?: number;
  maxSize?: number;
  accept?: Accept;
  disabled?: boolean;
};

// File Uploader Component
export const FileUploader: React.FC<FileUploaderProps & React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  dropzoneOptions,
  value,
  onValueChange,
  orientation = 'vertical',
  maxFiles = 1,
  maxSize = 4 * 1024 * 1024,
  accept,
  children,
  disabled = false,
  ...props
}) => {
  const [isFileTooBig, setIsFileTooBig] = useState(false);
  const [isLOF, setIsLOF] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const isSingleFile = maxFiles === 1;
  const direction: DirectionOptions = props.dir === 'rtl' ? 'rtl' : 'ltr';

  const removeFileFromSet = useCallback(
    (i: number) => {
      if (!value) return;
      if (isSingleFile) {
        onValueChange(null);
      } else {
        const newFiles = (value as File[]).filter((_, index) => index !== i);
        onValueChange(newFiles.length > 0 ? newFiles : null);
      }
    },
    [value, onValueChange, isSingleFile]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!value) return;

      const files = Array.isArray(value) ? value : [value];

      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex > files.length - 1 ? 0 : nextIndex);
      };

      const movePrev = () => {
        const nextIndex = activeIndex - 1;
        setActiveIndex(nextIndex < 0 ? files.length - 1 : nextIndex);
      };

      const prevKey =
        orientation === 'horizontal'
          ? direction === 'ltr'
            ? 'ArrowLeft'
            : 'ArrowRight'
          : 'ArrowUp';

      const nextKey =
        orientation === 'horizontal'
          ? direction === 'ltr'
            ? 'ArrowRight'
            : 'ArrowLeft'
          : 'ArrowDown';

      if (e.key === nextKey) {
        moveNext();
      } else if (e.key === prevKey) {
        movePrev();
      } else if (e.key === 'Enter' || e.key === 'Space') {
        if (activeIndex === -1) {
          dropzoneState.inputRef.current?.click();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (activeIndex !== -1) {
          removeFileFromSet(activeIndex);
          if (files.length - 1 === 0) {
            setActiveIndex(-1);
            return;
          }
          movePrev();
        }
      } else if (e.key === 'Escape') {
        setActiveIndex(-1);
      }
    },
    [value, activeIndex, removeFileFromSet, orientation, direction]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!acceptedFiles.length) {
        toast.error('File error, probably too big');
        return;
      }

      if (isSingleFile) {
        onValueChange(acceptedFiles[0]);
      } else {
        const newValues = value ? (Array.isArray(value) ? [...value] : [value]) : [];
        acceptedFiles.forEach(file => {
          if (newValues.length < maxFiles) {
            newValues.push(file);
          }
        });
        onValueChange(newValues);
      }

      if (rejectedFiles.length > 0) {
        for (let i = 0; i < rejectedFiles.length; i++) {
          if (rejectedFiles[i].errors[0]?.code === 'file-too-large') {
            toast.error(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
            break;
          }
          if (rejectedFiles[i].errors[0]?.message) {
            toast.error(rejectedFiles[i].errors[0].message);
            break;
          }
        }
      }
    },
    [isSingleFile, value, onValueChange, maxFiles, maxSize]
  );

  useEffect(() => {
    if (!value) {
      setIsLOF(false);
      return;
    }
    const files = Array.isArray(value) ? value : [value];
    setIsLOF(files.length >= maxFiles);
  }, [value, maxFiles]);

  const opts: DropzoneOptions = {
    accept,
    maxFiles,
    maxSize,
    disabled,
    ...dropzoneOptions
  };

  const dropzoneState = useDropzone({
    ...opts,
    onDrop: disabled ? undefined : onDrop,
    onDropRejected: disabled ? undefined : () => setIsFileTooBig(true),
    onDropAccepted: disabled ? undefined : () => setIsFileTooBig(false)
  });

  return (
    <FileUploaderContext.Provider
      value={{
        dropzoneState,
        isLOF: isLOF || disabled,
        isFileTooBig,
        removeFileFromSet,
        activeIndex,
        setActiveIndex,
        orientation,
        direction,
        isSingleFile
      }}
    >
      <div
        {...props}
        onKeyDownCapture={disabled ? undefined : handleKeyDown}
        className={cn(
          'grid w-full focus:outline-hidden overflow-hidden',
          disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
          className,
          {
            'gap-2': value && (Array.isArray(value) ? value.length > 0 : true)
          }
        )}
        dir={props.dir}
      >
        {children}
      </div>
    </FileUploaderContext.Provider>
  );
};
type FileUploaderContentProps = React.HTMLAttributes<HTMLDivElement>;

export const FileUploaderContent: React.FC<FileUploaderContentProps> = ({
  children,
  className,
  ...props
}) => {
  const { orientation } = useFileUpload();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn('w-full px-1')} ref={containerRef}>
      <div
        {...props}
        className={cn(
          'flex rounded-xl gap-1',
          orientation === 'horizontal' ? 'flex-raw flex-wrap' : 'flex-col',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

type FileUploaderItemProps = {
  index: number;
  file: File | string;
  // eslint-disable-next-line no-unused-vars
  onRemove: (index: number) => void;
  isSingleFile: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const FileUploaderItem: React.FC<FileUploaderItemProps> = ({
  className,
  index,
  file,
  onRemove,
  isSingleFile,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const { direction } = useFileUpload();

  useEffect(() => {
    if (file instanceof File) {
      try {
        const url = URL.createObjectURL(file);
        setObjectUrl(url);

        // Cleanup function
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Failed to create object URL:', error);
        setObjectUrl(null);
      }
    } else if (typeof file === 'string') {
      // If file is already a URL string, use it directly
      setObjectUrl(file);
    } else {
      setObjectUrl(null);
    }
  }, [file]);

  const getFileName = (): string => {
    if (file instanceof File) {
      return file.name;
    } else if (typeof file === 'string') {
      // Extract filename from URL
      try {
        const url = new URL(file, window.location.origin);
        const pathname = url.pathname;
        return pathname.split('/').pop() || 'Unknown file';
      } catch {
        return 'Unknown file';
      }
    }
    return 'Unknown file';
  };

  const getFileType = (): string => {
    if (file instanceof File) {
      return file.type;
    } else if (typeof file === 'string') {
      // Try to determine type from file extension
      const fileName = getFileName();
      const extension = fileName.split('.').pop()?.toLowerCase();

      switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
        case 'svg':
          return 'image/*';
        case 'mp4':
        case 'webm':
        case 'ogg':
          return 'video/*';
        default:
          return 'application/octet-stream';
      }
    }
    return 'application/octet-stream';
  };

  const isImageFile = (): boolean => {
    const fileType = getFileType();
    return fileType.startsWith('image/');
  };

  const isVideoFile = (): boolean => {
    const fileType = getFileType();
    return fileType.startsWith('video/');
  };

  const renderFilePreview = () => {
    const fileName = getFileName();

    if (isImageFile() && objectUrl) {
      return (
        <img
          src={objectUrl}
          alt={fileName}
          loading='lazy'
          className={cn('object-cover', isSingleFile ? 'size-10 mr-2' : 'w-full h-full')}
          onError={e => {
            // Fallback to file icon if image fails to load
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) {
              fallback.style.display = 'flex';
            }
          }}
        />
      );
    } else if (isVideoFile() && objectUrl && file instanceof File) {
      // Only show video preview for File objects, not URL strings
      return (
        <video
          src={objectUrl}
          className={cn('object-cover', isSingleFile ? 'size-10 mr-2' : 'w-full h-full')}
          onError={e => {
            // Fallback to file icon if video fails to load
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) {
              fallback.style.display = 'flex';
            }
          }}
        >
          <track kind='captions' />
        </video>
      );
    }

    // Default file icon fallback
    return (
      <div
        className={cn(
          'bg-gray-100 text-gray-400 flex items-center justify-center',
          isSingleFile ? 'size-10 mr-2' : 'w-full h-full'
        )}
      >
        <Icons name='IconFile' className='w-6 h-6' stroke={1} />
      </div>
    );
  };

  return (
    <div
      {...props}
      className={cn(
        buttonVariants({ variant: 'unstyle', size: 'md' }),
        'justify-between cursor-pointer relative group',
        isSingleFile ? 'px-3 py-2 flex items-center' : 'w-24 h-24 p-1',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderFilePreview()}

      {/* Hidden fallback for failed images/videos */}
      <div
        className={cn(
          'bg-gray-100 text-gray-400 items-center justify-center',
          isSingleFile ? 'size-10 mr-2' : 'w-full h-full',
          'hidden' // Initially hidden, shown when main preview fails
        )}
      >
        <Icons name='IconFile' className='w-6 h-6' stroke={1} />
      </div>

      {isSingleFile && <span className='truncate flex-1 ml-2'>{getFileName()}</span>}

      <Button
        variant='unstyle'
        className={cn(
          'absolute p-1 bg-slate-100 dark:bg-slate-800 text-white rounded-full transition-opacity',
          isHovered ? 'opacity-100' : 'opacity-0',
          isSingleFile ? 'top-1/2 -translate-y-1/2' : 'top-1',
          direction === 'rtl' ? 'left-1' : 'right-1'
        )}
        onClick={() => onRemove(index)}
        title='Remove file'
      >
        <Icons
          name='IconTrash'
          className='w-3 h-3 stroke-slate-800 dark:stroke-slate-100'
          stroke={2}
        />
      </Button>

      {!isSingleFile && (
        <div
          className='absolute bottom-1 left-1 right-1 text-xs truncate text-white bg-black/50 p-1 rounded-sm'
          title={getFileName()}
        >
          {getFileName()}
        </div>
      )}
    </div>
  );
};

type FileInputProps = React.HTMLAttributes<HTMLDivElement>;

export const FileInput: React.FC<FileInputProps> = ({ className, children, ...props }) => {
  const { dropzoneState, isFileTooBig, isLOF } = useFileUpload();
  const rootProps = isLOF ? {} : dropzoneState.getRootProps();

  return (
    <div
      {...props}
      className={`relative w-full focus:outline-hidden focus:ring-0 ${
        isLOF ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer '
      }${className ? ` ${className}` : ''}`}
    >
      <div
        className={cn(
          `w-full rounded-lg duration-300 ease-in-out focus:outline-hidden focus:ring-0
         ${
           dropzoneState.isDragAccept
             ? 'border-green-500'
             : dropzoneState.isDragReject || isFileTooBig
               ? 'border-red-500'
               : 'border-gray-300'
         }`,
          className
        )}
        {...(rootProps as unknown as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
      {/* @ts-ignore */}
      <input
        ref={dropzoneState.inputRef}
        disabled={isLOF}
        {...{}}
        className={`${isLOF ? 'cursor-not-allowed' : ''} rounded-none outline-hidden w-full focus:outline-hidden focus:ring-0 hidden`}
      />
    </div>
  );
};
