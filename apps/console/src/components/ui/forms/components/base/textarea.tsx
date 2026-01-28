import * as React from 'react';

import { cn } from '@ncobase/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1.5'>
        {label && (
          <label className='text-sm font-medium text-slate-900 dark:text-slate-100'>{label}</label>
        )}
        <textarea
          className={cn(
            'flex w-full min-h-[5rem] px-3 py-2 rounded-lg transition-all duration-200',
            // Base styles
            'bg-white dark:bg-slate-900',
            'border border-slate-200 dark:border-slate-700',
            'text-slate-900 dark:text-slate-100',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500',
            // Hover state
            'hover:bg-slate-50 dark:hover:bg-slate-800',
            // Focus state
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400',
            // Disabled state
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:shadow-none',
            className
          )}
          ref={ref}
          {...props}
        />
        {description && <p className='text-sm text-slate-500 dark:text-slate-400'>{description}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
