import React from 'react';

import { cn } from '@ncobase/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { Icons } from '../icon';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'w-3.5 h-3.5 shrink-0 rounded-sm border border-gray-300 text-primary-600 shadow-[0.03125rem_0.03125rem_0.125rem_0_rgba(0,0,0,0.03)] hover:border-gray-400/65',
      'disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:opacity-65',
      'data-[state=checked]:border-primary-600 data-[state=checked]:text-primary-600',
      '[&+label]:cursor-pointer [&+label]:inline-flex [&+label]:items-center [&+label]:text-nowrap',
      'disabled:[&+label]:cursor-not-allowed disabled:[&+label]:opacity-55 disabled:[&+label]:hover:opacity-65',
      'data-[state=checked]:[&+label]:text-primary-600',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Icons name='IconCheck' className='w-3 h-3 stroke-primary-600 stroke-[0.1875rem]' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';

export { Checkbox };
