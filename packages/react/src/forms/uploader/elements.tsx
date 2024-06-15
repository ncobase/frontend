import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import { cn } from '@ncobase/utils';
import { useDropzone, DropzoneState, FileRejection, DropzoneOptions, Accept } from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '../../button';
import { getButtonStyling } from '../../button/styles';
import { Icons } from '../../icon';
import { Input } from '../input';

type DirectionOptions = 'rtl' | 'ltr' | undefined;

type FileUploaderContextType = {
  dropzoneState: DropzoneState;
  isLOF: boolean;
  isFileTooBig: boolean;
  removeFileFromSet: (index: number) => void;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  orientation: 'horizontal' | 'vertical';
  direction: DirectionOptions;
};

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error('useFileUpload must be used within a FileUploaderProvider');
  }
  return context;
};

export type FileUploaderProps = {
  value: File[] | null;
  onValueChange: (value: File[] | null) => void;
  dropzoneOptions?: DropzoneOptions;
  orientation?: 'horizontal' | 'vertical';
  maxFiles?: number;
  maxSize?: number;
  accept?: Accept;
};

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
  ...props
}) => {
  const [isFileTooBig, setIsFileTooBig] = useState(false);
  const [isLOF, setIsLOF] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const reSelectAll = maxFiles === 1;
  const direction: DirectionOptions = props.dir === 'rtl' ? 'rtl' : 'ltr';

  const removeFileFromSet = useCallback(
    (i: number) => {
      if (!value) return;
      const newFiles = value.filter((_, index) => index !== i);
      onValueChange(newFiles);
    },
    [value, onValueChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!value) return;

      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex > value.length - 1 ? 0 : nextIndex);
      };

      const movePrev = () => {
        const nextIndex = activeIndex - 1;
        setActiveIndex(nextIndex < 0 ? value.length - 1 : nextIndex);
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
          if (value.length - 1 === 0) {
            setActiveIndex(-1);
            return;
          }
          movePrev();
        }
      } else if (e.key === 'Escape') {
        setActiveIndex(-1);
      }
    },
    [value, activeIndex, removeFileFromSet]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const files = acceptedFiles;

      if (!files) {
        toast.error('file error , probably too big');
        return;
      }

      const newValues: File[] = value ? [...value] : [];

      if (reSelectAll) {
        newValues.splice(0, newValues.length);
      }

      files.forEach(file => {
        if (newValues.length < maxFiles) {
          newValues.push(file);
        }
      });

      onValueChange(newValues);

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
    [reSelectAll, value]
  );

  useEffect(() => {
    if (!value) return;
    if (value.length === maxFiles) {
      setIsLOF(true);
      return;
    }
    setIsLOF(false);
  }, [value, maxFiles]);

  const opts: DropzoneOptions = {
    accept: accept,
    maxFiles: maxFiles,
    maxSize: maxSize,
    ...dropzoneOptions
  };

  const dropzoneState = useDropzone({
    ...opts,
    onDrop,
    onDropRejected: () => setIsFileTooBig(true),
    onDropAccepted: () => setIsFileTooBig(false)
  });

  return (
    <FileUploaderContext.Provider
      value={{
        dropzoneState,
        isLOF,
        isFileTooBig,
        removeFileFromSet,
        activeIndex,
        setActiveIndex,
        orientation,
        direction
      }}
    >
      <div
        {...props}
        onKeyDownCapture={handleKeyDown}
        className={cn('grid w-full focus:outline-none overflow-hidden ', className, {
          'gap-2': value && value.length > 0
        })}
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
    <div className={cn('w-full px-1')} ref={containerRef} aria-description='content file holder'>
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
} & React.HTMLAttributes<HTMLDivElement>;

export const FileUploaderItem: React.FC<FileUploaderItemProps> = ({
  className,
  index,
  children,
  ...props
}) => {
  const { removeFileFromSet, activeIndex, direction } = useFileUpload();
  const isSelected = index === activeIndex;
  return (
    <div
      {...props}
      className={cn(
        getButtonStyling('unstyle', 'md'),
        'h-6 p-1 justify-between cursor-pointer relative',
        className,
        isSelected ? 'bg-muted' : ''
      )}
    >
      <div className='font-medium leading-none tracking-tight flex items-center gap-1.5 h-full w-full'>
        {children}
      </div>
      <Button
        variant='unstyle'
        className={cn('absolute p-0.5', direction === 'rtl' ? 'top-0 left-0' : 'top-0 right-0')}
        onClick={() => removeFileFromSet(index)}
        title='Click to remove file'
      >
        <Icons name='IconTrash' className='stroke-slate-400' stroke={1} />
      </Button>
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
      className={`relative w-full ${
        isLOF ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer '
      }${className ? ` ${className}` : ''}`}
    >
      <div
        className={cn(
          `w-full rounded-lg duration-300 ease-in-out
         ${
           dropzoneState.isDragAccept
             ? 'border-green-500'
             : dropzoneState.isDragReject || isFileTooBig
               ? 'border-red-500'
               : 'border-gray-300'
         }`,
          className
        )}
        {...rootProps}
      >
        {children}
      </div>
      <Input
        ref={dropzoneState.inputRef}
        disabled={isLOF}
        {...dropzoneState.getInputProps()}
        className={`${isLOF ? 'cursor-not-allowed' : ''} rounded-none outline-none w-full`}
      />
    </div>
  );
};
