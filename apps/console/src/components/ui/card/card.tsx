import React from 'react';

import { cn } from '@ncobase/utils';

interface CardProps extends React.ComponentProps<'div'> {}

function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      data-slot='card'
      className={cn(
        'border rounded-lg transition-colors duration-200',
        'border-slate-100 dark:border-slate-700',
        'hover:shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        'px-4 py-3 flex items-center justify-between rounded-t-lg',
        'bg-white dark:bg-slate-900',
        'transition-colors duration-200',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-title'
      className={cn(
        'font-semibold text-slate-800 dark:text-slate-100',
        'transition-colors duration-200',
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-description'
      className={cn(
        'text-xs text-slate-500 dark:text-slate-400',
        'transition-colors duration-200 mt-0.5',
        className
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn('flex items-center space-x-3', className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  collapsed = false,
  ...props
}: React.ComponentProps<'div'> & { collapsed?: boolean }) {
  return (
    <div
      data-slot='card-content'
      className={cn(
        'transition-all duration-300 ease-in-out',
        'bg-white dark:bg-slate-900',
        collapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100',
        'px-4 py-3 rounded-b-lg',
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn(
        'flex items-center px-4 py-3',
        'bg-white dark:bg-slate-900 rounded-b-lg',
        className
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
