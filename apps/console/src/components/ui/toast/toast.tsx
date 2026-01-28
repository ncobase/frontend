import React, { useEffect, useState } from 'react';

import { cn } from '@ncobase/utils';

import { Toast as ToastType } from './toast-context';

import { Icons } from '@/components/ui/icon';

interface ToastProps {
  toast: ToastType;
  onDismiss: () => void;
}

export const ToastItem: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Get icon based on toast type
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Icons name='IconCheck' className='text-green-500' />;
      case 'error':
        return <Icons name='IconAlertCircle' className='text-red-500' />;
      case 'warning':
        return <Icons name='IconAlertTriangle' className='text-amber-500' />;
      case 'info':
      default:
        return <Icons name='IconInfo' className='text-blue-500' />;
    }
  };

  // Get background color based on toast type
  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleDismiss = () => {
    // Animate out
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const handleClick = () => {
    if (toast.onClick) {
      toast.onClick();
    }
  };

  return (
    <div
      className={cn(
        'flex items-start p-4 rounded-lg shadow-md border mb-3 max-w-md w-full transform transition-all duration-300 ease-in-out',
        getBackgroundColor(),
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        toast.onClick && 'cursor-pointer'
      )}
      role='alert'
      onClick={handleClick}
    >
      <div className='shrink-0 mr-3 mt-0.5'>{getIcon()}</div>
      <div className='grow'>
        <h4 className='font-medium text-slate-800'>{toast.message}</h4>
        {toast.description && <p className='text-xs text-slate-600 mt-1'>{toast.description}</p>}
      </div>
      <button
        type='button'
        className='ml-2 text-slate-400 hover:text-slate-600 focus:outline-hidden shrink-0'
        onClick={e => {
          e.stopPropagation();
          handleDismiss();
        }}
        aria-label='Close'
      >
        <Icons name='IconX' size={16} />
      </button>
    </div>
  );
};
