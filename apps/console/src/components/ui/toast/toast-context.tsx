import React, { createContext, useCallback, useContext, useReducer } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
  duration?: number;
  /**
   * Custom callback when toast is dismissed
   */
  onDismiss?: () => void;
  /**
   * Custom callback when toast is clicked
   */
  onClick?: () => void;
}

// Action types
type ToastAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'CLEAR_TOASTS' };

// State type
interface ToastState {
  toasts: Toast[];
}

// Initial state
const initialState: ToastState = {
  toasts: []
};

// Reducer function
const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };

    case 'CLEAR_TOASTS':
      return {
        ...state,
        toasts: []
      };

    default:
      return state;
  }
};

// Context interface
interface ToastContextValue {
  toasts: Toast[];
  // eslint-disable-next-line no-unused-vars
  addToast: (toast: Omit<Toast, 'id'>) => string;
  // eslint-disable-next-line no-unused-vars
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

// Create context
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Provider component
export const ToastProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  // Generate unique ID for toasts
  const generateId = () => `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Add a toast
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = { ...toast, id };

    dispatch({ type: 'ADD_TOAST', payload: newToast });

    // Auto-dismiss after specified duration
    if (toast.duration !== 0) {
      const duration = toast.duration || 5000; // Default 5 seconds
      setTimeout(() => {
        removeToast(id);
        if (toast.onDismiss) toast.onDismiss();
      }, duration);
    }

    return id;
  }, []);

  // Remove a toast
  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    dispatch({ type: 'CLEAR_TOASTS' });
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        addToast,
        removeToast,
        clearToasts
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook for using the toast context
export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
