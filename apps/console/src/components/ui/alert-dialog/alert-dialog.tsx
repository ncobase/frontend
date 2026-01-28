import React, { useEffect, useState } from 'react';

import { cn } from '@ncobase/utils';

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger
} from './alert-dialog.elements';

import { ScrollView } from '@/components/ui/views';

interface AlertDialogProps {
  /**
   * AlertDialog title
   */
  title?: string;
  /**
   * AlertDialog description
   */
  description?: string;
  /**
   * AlertDialog children elements
   */
  children?: React.ReactNode;
  /**
   * AlertDialog trigger, it should be a button or a link
   */
  trigger?: React.ReactNode;
  /**
   * AlertDialog footer, any element
   */
  footer?: React.ReactNode;
  /**
   * AlertDialog className
   */
  className?: string;
  /**
   * Is alertDialog open, default is false
   */
  isOpen?: boolean;
  /**
   * Callback when alertDialog is open or close
   */
  onChange?: () => void;
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
  onConfirm?: () => void;
  /**
   * Confirm button text, default is 'Confirm'
   */
  confirmText?: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
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
  children
}) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleChange = () => {
    setOpen(prevStatus => !prevStatus);
    onChange?.();
  };

  return (
    <AlertDialogRoot open={open} onOpenChange={handleChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className={cn(className)}>
        {title || description ? (
          <AlertDialogHeader>
            {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
            {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
          </AlertDialogHeader>
        ) : null}
        {children && <ScrollView className='flex-1'>{children}</ScrollView>}
        {(footer || onCancel || onConfirm) && (
          <AlertDialogFooter>
            {footer}
            {!footer && onCancel && (
              <AlertDialogCancel onClick={onCancel}>{cancelText || 'Cancel'}</AlertDialogCancel>
            )}
            {!footer && onConfirm && (
              <AlertDialogAction onClick={onConfirm}>{confirmText || 'Confirm'}</AlertDialogAction>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};
