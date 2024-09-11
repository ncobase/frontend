import React, { memo, ReactNode, useCallback } from 'react';

import { Dialog } from '@ncobase/react';

import { ExplicitAny } from '@/types';

export interface ModalProps<T extends object> {
  title?: string;
  children?: ReactNode | ((record: T | null) => ReactNode) | ExplicitAny;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: ExplicitAny;
  onChange?: () => void;
  onCancel?: () => void;
  record?: T | null;
  isOpen?: boolean;
  className?: string;
  isMaximized?: boolean;
  toolbar?: ReactNode;
}

export const Modal = memo(
  <T extends object>({
    children,
    title,
    confirmText,
    cancelText,
    onConfirm,
    onChange,
    onCancel,
    record,
    isOpen = false,
    ...rest
  }: ModalProps<T>) => {
    const renderChildren = useCallback(() => {
      return typeof children === 'function' ? children(record) : children;
    }, [children, record]);

    return (
      <Dialog
        isOpen={isOpen}
        title={title}
        onChange={onChange || onCancel}
        onCancel={onCancel}
        cancelText={cancelText}
        onConfirm={confirmText ? () => onConfirm?.(record) : undefined}
        confirmText={confirmText}
        {...rest}
      >
        {renderChildren()}
      </Dialog>
    );
  }
);
