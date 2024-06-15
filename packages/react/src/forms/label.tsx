import React from 'react';

import { cn } from '@ncobase/utils';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

const labelVariants = cva(
  'leading-[15px] peer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 hover:text-slate-600/85'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = 'Label';

export { Label };
