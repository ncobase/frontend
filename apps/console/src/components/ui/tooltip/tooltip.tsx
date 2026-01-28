import * as React from 'react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/components/ui/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-999 overflow-hidden rounded-md bg-white/95 backdrop-blur-xs shadow-[0_0_6px_rgba(0,0,0,0.05)] border border-gray-100 px-3 py-1.5 mx-2.5 text-slate-500 text-xs font-medium animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-85 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider };

export function Tooltip({
  children,
  content,
  className,
  ...props
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof TooltipContent>) {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className={className} {...props}>
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
}
