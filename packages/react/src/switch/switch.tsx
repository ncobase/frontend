import React from 'react';

import { cn } from '@ncobase/utils';
import * as SwitchPrimitives from '@radix-ui/react-switch';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full bg-white border-2 border-transparent shadow-[0_0_2px_rgb(203,213,225)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-3.5 w-3.5 rounded-full bg-slate-400 shadow-lg border-slate-300 ring-0 transition-transform data-[state=checked]:bg-primary-500 data-[state=checked]:translate-x-3.5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = 'Switch';

export { Switch };
