import React from 'react';

import { cn } from '@ncobase/utils';

import { Portal } from '../portal';

import { ToastItem } from './toast';
import { useToast } from './toast-context';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

interface ToastContainerProps {
  /**
   * Position of the toast container
   * @default 'top-right'
   */
  position?: ToastPosition;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Maximum number of toasts to show at once
   * @default 5
   */
  maxToasts?: number;

  /**
   * Whether to disable portal rendering
   * @default false
   */
  disablePortal?: boolean;

  /**
   * Custom container element for the portal
   */
  container?: HTMLElement | null;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  className,
  maxToasts = 5,
  disablePortal = false,
  container
}) => {
  const { toasts, removeToast } = useToast();

  // Limit the number of toasts shown
  const visibleToasts = toasts.slice(0, maxToasts);

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const containerContent = (
    <div
      className={cn('fixed z-9999 flex flex-col items-end', getPositionClasses(), className)}
      aria-live='polite'
      role='region'
      aria-label='Notifications'
    >
      {visibleToasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}

      {/* Show count of hidden toasts */}
      {toasts.length > maxToasts && (
        <div className='text-xs text-slate-600 text-center w-full mt-1 bg-white/80 px-2 py-1 rounded-md shadow-xs'>
          +{toasts.length - maxToasts} more notification{toasts.length - maxToasts !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );

  return (
    <Portal disablePortal={disablePortal} container={container}>
      {containerContent}
    </Portal>
  );
};
