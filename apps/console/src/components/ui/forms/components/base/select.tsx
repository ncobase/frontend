import React from 'react';

import { cn } from '@ncobase/utils';
import * as SelectPrimitive from '@radix-ui/react-select';

import { Icons } from '@/components/ui/icon';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> {
  allowClear?: boolean;
  onClear?: (_e: React.MouseEvent) => void;
  value?: string;
}

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, allowClear, onClear, value, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex w-full px-3 py-2 rounded-lg transition-colors duration-200',
      // Base styles
      'bg-white dark:bg-slate-900',
      'border border-slate-200 dark:border-slate-700',
      'text-slate-900 dark:text-slate-100',
      // Hover state
      'hover:bg-slate-50 dark:hover:bg-slate-800',
      // Focus state
      'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400',
      // Other states
      'items-center justify-between whitespace-nowrap',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'disabled:hover:bg-transparent dark:disabled:hover:bg-transparent',
      '[&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    {allowClear && value && (
      <div
        className='ml-auto cursor-pointer outline-hidden mr-1 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400'
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onClear?.(e);
        }}
      >
        <Icons name='IconX' className='w-3.5 h-3.5' />
      </div>
    )}

    <SelectPrimitive.Icon asChild>
      <Icons name='IconChevronDown' className='text-slate-500 dark:text-slate-400' />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

SelectTrigger.displayName = 'SelectTrigger';

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-999 max-h-96 min-w-[8rem] overflow-hidden rounded-lg',
        'bg-white dark:bg-slate-900',
        'border border-slate-200 dark:border-slate-700',
        'shadow-lg dark:shadow-slate-900/20',
        // Animations
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className='flex h-6 cursor-default items-center justify-center bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400'>
        <Icons name='IconChevronUp' />
      </SelectPrimitive.ScrollUpButton>

      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>

      <SelectPrimitive.ScrollDownButton className='flex h-6 cursor-default items-center justify-center bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400'>
        <Icons name='IconChevronDown' />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

SelectContent.displayName = 'SelectContent';

export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full select-none items-center rounded-md py-2 pl-4 pr-3 gap-x-2',
      'text-slate-900 dark:text-slate-100 cursor-pointer',
      'hover:bg-slate-100 dark:hover:bg-slate-800',
      'focus:bg-slate-100 dark:focus:bg-slate-800 focus:outline-none',
      'data-disabled:cursor-not-allowed data-disabled:opacity-50',
      'data-disabled:pointer-events-none',
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className='flex h-3.5 w-3.5 items-center ml-auto'>
      <SelectPrimitive.ItemIndicator>
        <Icons name='IconCheck' className='text-primary-500 dark:text-primary-400' />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));

SelectItem.displayName = 'SelectItem';

export const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300', className)}
    {...props}
  />
));

SelectLabel.displayName = 'SelectLabel';

export const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-slate-200 dark:bg-slate-700', className)}
    {...props}
  />
));

SelectSeparator.displayName = 'SelectSeparator';
