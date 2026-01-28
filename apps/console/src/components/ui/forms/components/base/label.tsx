'use client';

import * as React from 'react';

import { cn } from '@ncobase/utils';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

const labelVariants = cva(
  cn(
    'text-sm font-medium leading-[15px] transition-colors duration-200',
    // Base styles
    'text-slate-700 dark:text-slate-300',
    // Hover state
    'hover:text-slate-900 dark:hover:text-slate-100',
    // Disabled state
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    // Focus state of associated input
    'peer-focus:text-primary-600 dark:peer-focus:text-primary-400',
    // Required state
    '[&[data-required]]:after:content-["*"] [&[data-required]]:after:ml-1 [&[data-required]]:after:text-red-500'
  )
);

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;
