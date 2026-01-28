import { useCallback } from 'react';

import { useToast, ToastType } from './toast-context';

interface ToastOptions {
  description?: string;
  duration?: number;
  onDismiss?: () => void;
  onClick?: () => void;
}

/**
 * A hook that provides simplified methods for showing different types of toasts
 */
export const useToastMessage = () => {
  const { addToast, removeToast, clearToasts, toasts } = useToast();

  // Success toast
  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast({
        message,
        type: 'success',
        ...options
      });
    },
    [addToast]
  );

  // Error toast
  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast({
        message,
        type: 'error',
        ...options
      });
    },
    [addToast]
  );

  // Warning toast
  const warning = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast({
        message,
        type: 'warning',
        ...options
      });
    },
    [addToast]
  );

  // Info toast
  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast({
        message,
        type: 'info',
        ...options
      });
    },
    [addToast]
  );

  // Custom toast with specific type
  const custom = useCallback(
    (message: string, type: ToastType, options?: ToastOptions) => {
      return addToast({
        message,
        type,
        ...options
      });
    },
    [addToast]
  );

  // Dismiss a toast by ID
  const dismiss = useCallback(
    (id: string) => {
      removeToast(id);
    },
    [removeToast]
  );

  // Clear all toasts
  const clear = useCallback(() => {
    clearToasts();
  }, [clearToasts]);

  // Check if a specific toast exists
  const exists = useCallback(
    (id: string) => {
      return toasts.some(toast => toast.id === id);
    },
    [toasts]
  );

  // Update an existing toast
  const update = useCallback(
    (
      id: string,
      updates: Partial<Omit<ToastOptions & { message: string; type: ToastType }, 'id'>>
    ) => {
      // Remove the old toast
      removeToast(id);

      // Find the original toast
      const originalToast = toasts.find(toast => toast.id === id);

      // If found, create a new one with updated properties
      if (originalToast) {
        return addToast({
          ...originalToast,
          ...updates
        });
      }

      return null;
    },
    [toasts, removeToast, addToast]
  );

  return {
    success,
    error,
    warning,
    info,
    custom,
    dismiss,
    clear,
    exists,
    update,
    toasts
  };
};
