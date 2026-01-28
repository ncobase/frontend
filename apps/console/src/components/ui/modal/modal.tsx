import { memo, ReactNode, useCallback } from 'react';

import { Dialog, DialogViewProps } from '@/components/ui/dialog';

export interface ModalProps<T> extends DialogViewProps {
  children?: ReactNode | ((_record: T | null) => ReactNode) | any;
  record?: T | null;
  isMaximized?: boolean;
}

export const Modal = memo(
  <T extends object>({
    children,
    title,
    description,
    confirmText,
    cancelText,
    onConfirm,
    onChange,
    onCancel,
    record,
    isOpen = false,
    confirmDisabled,
    confirmVariant,
    loading,
    size,
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
        description={description}
        confirmDisabled={confirmDisabled}
        confirmVariant={confirmVariant}
        loading={loading}
        size={size}
        {...rest}
      >
        {renderChildren()}
      </Dialog>
    );
  }
);
