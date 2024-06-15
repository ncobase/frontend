import React from 'react';

import { cn } from '@ncobase/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex px-3 py-2.5 w-full bg-slate-50/55 hover:bg-slate-50/25 border border-slate-200/65 shadow-[0.03125rem_0.03125rem_0.125rem_0_rgba(0,0,0,0.03)] focus:border-primary-600 text-slate-500 rounded-md transition-colors',
          'file:border-0 file:bg-transparent file:font-medium',
          'disabled:cursor-not-allowed disabled:opacity-55 disabled:pointer-events-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
