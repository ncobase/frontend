import * as React from 'react';

import { cn } from '@ncobase/utils';
import { cva } from 'class-variance-authority';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'slate'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'rose'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'cyan'
  | 'outline'
  | 'destructive'
  | 'default'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-warning'
  | 'outline-danger'
  | 'outline-slate'
  | 'outline-blue'
  | 'outline-indigo'
  | 'outline-purple'
  | 'outline-pink'
  | 'outline-rose'
  | 'outline-orange'
  | 'outline-yellow'
  | 'outline-green'
  | 'outline-teal'
  | 'outline-cyan';

export type BadgeSize = 'dot' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full transition-colors font-medium',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80 ring-primary/10',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 dark:hover:bg-secondary/80 ring-secondary/10',
        success:
          'bg-success-500 text-white hover:bg-success-600 dark:bg-success-600 dark:hover:bg-success-700 ring-success-200',
        warning:
          'bg-warning-500 text-white hover:bg-warning-600 dark:bg-warning-600 dark:hover:bg-warning-700 ring-warning-200',
        danger:
          'bg-destructive text-white hover:bg-destructive-600 dark:bg-destructive dark:hover:bg-destructive/90 ring-destructive-200',
        slate:
          'bg-slate-500 text-white hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700 ring-slate-200',
        blue: 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 ring-blue-200',
        indigo:
          'bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 ring-indigo-200',
        purple:
          'bg-purple-500 text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 ring-purple-200',
        pink: 'bg-pink-500 text-white hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 ring-pink-200',
        rose: 'bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 ring-rose-200',
        orange:
          'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 ring-orange-200',
        yellow:
          'bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 ring-yellow-200',
        green:
          'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 ring-green-200',
        teal: 'bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 ring-teal-200',
        cyan: 'bg-cyan-500 text-white hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 ring-cyan-200',
        outline:
          'border border-secondary text-secondary hover:bg-secondary/10 dark:hover:bg-secondary/20 dark:text-secondary-foreground',
        destructive:
          'bg-destructive text-white hover:bg-destructive-600 dark:bg-destructive dark:hover:bg-destructive/90 ring-destructive-200',
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80 ring-primary/10',
        'outline-primary':
          'border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20 dark:text-primary-foreground',
        'outline-secondary':
          'border border-secondary text-secondary hover:bg-secondary/10 dark:hover:bg-secondary/20 dark:text-secondary-foreground',
        'outline-success':
          'border border-success-500 text-success-700 hover:bg-success-50 dark:text-success-400 dark:hover:bg-success-950',
        'outline-warning':
          'border border-warning-500 text-warning-700 hover:bg-warning-50 dark:text-warning-400 dark:hover:bg-warning-950',
        'outline-danger':
          'border border-destructive text-destructive hover:bg-destructive/10 dark:text-destructive-400 dark:hover:bg-destructive-950',
        'outline-slate':
          'border border-slate-500 text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-950',
        'outline-blue':
          'border border-blue-500 text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950',
        'outline-indigo':
          'border border-indigo-500 text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950',
        'outline-purple':
          'border border-purple-500 text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950',
        'outline-pink':
          'border border-pink-500 text-pink-700 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-950',
        'outline-rose':
          'border border-rose-500 text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950',
        'outline-orange':
          'border border-orange-500 text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950',
        'outline-yellow':
          'border border-yellow-500 text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-950',
        'outline-green':
          'border border-green-500 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950',
        'outline-teal':
          'border border-teal-500 text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950',
        'outline-cyan':
          'border border-cyan-500 text-cyan-700 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950'
      },
      size: {
        dot: 'w-2.5 h-2.5',
        xs: 'text-xs px-2 py-0.5',
        sm: 'text-xs px-2.5 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
        xl: 'text-base px-3.5 py-1.5'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'sm'
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size: children ? size : 'dot' }),
          'backdrop-blur-sm backdrop-saturate-150',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
