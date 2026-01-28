import React from 'react';

import { cn } from '@ncobase/utils';
import * as SwitchPrimitives from '@radix-ui/react-switch';

export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
      'bg-slate-300 dark:bg-slate-600',
      'hover:bg-slate-400 dark:hover:bg-slate-500',
      'data-[state=checked]:bg-primary-400 dark:data-[state=checked]:bg-primary-300',
      'data-[state=checked]:hover:bg-primary-500 dark:data-[state=checked]:hover:bg-primary-400',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-all',
        'bg-white dark:bg-slate-50',
        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5',
        'data-[state=checked]:scale-110 data-[state=unchecked]:scale-100',
        'data-[state=checked]:shadow-primary-400/50 dark:data-[state=checked]:shadow-primary-300/50'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = 'Switch';
