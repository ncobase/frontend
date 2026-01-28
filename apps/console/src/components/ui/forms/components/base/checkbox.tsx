import * as React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { Icons } from '@/components/ui/icon';
import { cn } from '@/components/ui/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot='checkbox'
      className={cn(
        'flex size-4.5 shrink-0 items-center justify-center rounded-sm transition-all duration-200',
        // Light mode styles
        'bg-white border border-slate-200',
        'text-slate-900',
        // Dark mode styles
        'dark:bg-slate-900 dark:border-slate-700',
        'dark:text-slate-100',
        // Checked state
        'data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500',
        'data-[state=checked]:text-white dark:data-[state=checked]:text-slate-900',
        // Focus state
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        'dark:focus:border-primary-400',
        // Invalid state
        'aria-invalid:border-red-500 aria-invalid:ring-red-500/20',
        'dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-400/20',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50',
        'disabled:hover:bg-transparent dark:disabled:hover:bg-transparent',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        className={cn(
          'flex items-center justify-center text-current',
          'transition-transform duration-200',
          'data-[state=checked]:scale-100 data-[state=unchecked]:scale-0'
        )}
      >
        <Icons name='IconCheck' className='size-3.5' />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
