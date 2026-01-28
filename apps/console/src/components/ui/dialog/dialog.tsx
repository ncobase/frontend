import React, { useEffect, useState } from 'react';

import { cn } from '@ncobase/utils';

import { Button, buttonVariants } from '../button';
import { ScrollView } from '../views';

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from './dialog.elements';

export interface DialogViewProps<T = any> {
  /**
   * Dialog title
   */
  title?: string;
  /**
   * Dialog description
   */
  description?: string;
  /**
   * Dialog children elements
   */
  children?: React.ReactNode;
  /**
   * Dialog trigger, it should be a button or a link
   */
  trigger?: React.ReactNode;
  /**
   * Dialog footer, any element
   */
  footer?: React.ReactNode;
  /**
   * Dialog className
   */
  className?: string;
  /**
   * Is dialog open, default is false
   */
  isOpen?: boolean;
  /**
   * Callback when dialog is open or close
   */
  onChange?: (_record?: T) => void;
  /**
   * Cancel button, if footer is not defined it will be displayed
   */
  onCancel?: () => void;
  /**
   * Cancel button text, default is 'Cancel'
   */
  cancelText?: string;
  /**
   * Confirm button, if footer is not defined it will be displayed
   */
  onConfirm?: (_record?: T) => void;
  /**
   * Confirm button text, default is 'Confirm'
   */
  confirmText?: string;
  /**
   * Dialog header toolbar elements
   */
  toolbar?: React.ReactNode;
  /**
   * Whether the confirm button is disabled
   */
  confirmDisabled?: boolean;
  /**
   * Variant of the confirm button
   */
  confirmVariant?: string;
  /**
   * Loading state of the confirm button
   */
  loading?: boolean;
  /**
   * Dialog size, default is 'default'
   */
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | 'full';
}

export const Dialog = <T,>({
  title,
  description,
  isOpen,
  onChange,
  trigger,
  footer,
  onCancel,
  cancelText,
  onConfirm,
  confirmText,
  className,
  toolbar,
  children,
  confirmDisabled,
  confirmVariant = 'primary',
  loading,
  size = 'default'
}: DialogViewProps<T>) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleChange = () => {
    setOpen(prevStatus => !prevStatus);
    onChange?.();
  };

  const sizeClasses = {
    xs: 'max-w-[30vw] min-w-[240px]',
    sm: 'max-w-[40vw] min-w-[320px]',
    default: 'max-w-[60vw] min-w-[480px]',
    lg: 'max-w-[75vw] min-w-[640px]',
    xl: 'max-w-[90vw] min-w-[800px]',
    full: 'max-w-[calc(100vw-4rem)] min-w-[320px]'
  };

  return (
    <DialogRoot open={open} onOpenChange={handleChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          'min-h-[200px]',
          'max-h-[90vh]',
          'bg-white dark:bg-slate-900',
          'rounded-lg shadow-lg',
          'border border-slate-200 dark:border-slate-700',
          'backdrop-blur-sm',
          'transition-all duration-200',
          'animate-in fade-in-0 zoom-in-95',
          sizeClasses[size],
          className
        )}
      >
        {title || description ? (
          <DialogHeader className='-mx-6 px-6 pb-4 border-b border-slate-200 dark:border-slate-700'>
            {title && (
              <DialogTitle className='text-lg font-semibold text-slate-900 dark:text-white'>
                {title}
              </DialogTitle>
            )}
            <DialogDescription className='mt-1.5 text-sm text-slate-500 dark:text-slate-400 whitespace-pre-line'>
              {description}
            </DialogDescription>
            {toolbar && (
              <div
                className='absolute top-3 right-12 flex items-center gap-2'
                id='dialog-header-actions'
              >
                {toolbar}
              </div>
            )}
          </DialogHeader>
        ) : null}
        <ScrollView
          className={cn(
            'flex-1 overflow-auto',
            'text-slate-600 dark:text-slate-300',
            !(title || description) ? 'pt-6' : 'pt-4'
          )}
        >
          {children}
        </ScrollView>
        {(footer || onCancel || onConfirm) && (
          <DialogFooter
            className={cn(
              'border-t border-slate-200 dark:border-slate-700',
              'pt-4 mt-4 -mx-6 px-6',
              'flex justify-end gap-3'
            )}
          >
            {footer}
            {!footer && onCancel && (
              <Button
                onClick={onCancel}
                variant='slate'
                className='hover:bg-slate-100 dark:hover:bg-slate-800'
              >
                {cancelText || 'Cancel'}
              </Button>
            )}
            {!footer && onConfirm && (
              <button
                onClick={() => onConfirm({} as T)}
                disabled={confirmDisabled || loading}
                className={cn(
                  buttonVariants({ variant: confirmVariant as any }),
                  'transition-all duration-200',
                  'shadow-sm hover:shadow-md',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {loading ? 'Loading...' : confirmText || 'Confirm'}
              </button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
};
