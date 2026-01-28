import * as React from 'react';

import { cn } from '@ncobase/utils';

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full px-3 py-2 rounded-lg transition-all duration-200',
          // Light mode styles
          'bg-white dark:bg-slate-900',
          'border border-slate-200 dark:border-slate-700',
          'text-slate-900 dark:text-slate-100',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          // Hover state
          'hover:bg-slate-50 dark:hover:bg-slate-800',
          // Focus state
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400',
          // File input specific styles
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:shadow-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
