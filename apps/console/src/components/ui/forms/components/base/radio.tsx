import React from 'react';

import { cn } from '@ncobase/utils';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { Icons } from '@/components/ui/icon';

export const RadioGroupRoot = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', 'transition-colors duration-200', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroupRoot.displayName = 'RadioGroupRoot';

export const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full transition-all duration-200',
        // Light mode styles
        'bg-white dark:bg-slate-900',
        'border-1 border-slate-300 dark:border-slate-600',
        // Hover state
        'hover:border-slate-400 dark:hover:border-slate-500',
        // Checked state
        'data-[state=checked]:border-primary-500 dark:data-[state=checked]:border-primary-400',
        'data-[state=checked]:bg-primary-500 dark:data-[state=checked]:bg-primary-400',
        // Focus state
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 dark:focus-visible:ring-primary-400/20',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50',
        'disabled:hover:border-slate-300 dark:disabled:hover:border-slate-600',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
        <Icons
          name='IconCheck'
          className={cn('h-2.5 w-2.5', 'text-white dark:text-slate-900', 'stroke-[3px]')}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = 'RadioGroupItem';
