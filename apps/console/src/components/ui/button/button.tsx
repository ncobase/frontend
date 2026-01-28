import * as React from 'react';

import { cn } from '@ncobase/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { Icons } from '@/components/ui/icon';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-x-1.5 whitespace-nowrap rounded-md font-500 ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:size-4 shadow-xs hover:shadow-md active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground [&_svg]:text-primary-foreground hover:bg-primary/90 dark:bg-primary-600 dark:hover:bg-primary-700',
        primary:
          'bg-primary text-primary-foreground [&_svg]:text-primary-foreground hover:bg-primary/90 dark:bg-primary-600 dark:hover:bg-primary-700',
        destructive:
          'bg-destructive text-destructive-foreground [&_svg]:text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive-600 dark:hover:bg-destructive-700',
        danger:
          'bg-destructive text-destructive-foreground [&_svg]:text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive-600 dark:hover:bg-destructive-700',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground [&_svg]:text-foreground dark:border-slate-700 dark:hover:bg-slate-800',
        secondary:
          'bg-secondary text-secondary-foreground [&_svg]:text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary-600 dark:hover:bg-secondary-700',
        ghost:
          'hover:bg-accent hover:text-accent-foreground [&_svg]:text-foreground dark:hover:bg-slate-800',
        link: 'text-primary [&_svg]:text-primary underline-offset-4 hover:underline shadow-none hover:shadow-none dark:text-primary-400',

        'outline-primary':
          'border border-primary text-primary [&_svg]:text-primary bg-transparent hover:bg-primary/10 dark:border-primary-400 dark:text-primary-400',
        'outline-secondary':
          'border border-secondary text-secondary [&_svg]:text-secondary bg-transparent hover:bg-secondary/10 dark:border-secondary-400 dark:text-secondary-400',
        'outline-success':
          'border border-success-500 text-success-500 [&_svg]:text-success-500 bg-transparent hover:bg-success-50 dark:border-success-400 dark:text-success-400',
        'outline-warning':
          'border border-warning-500 text-warning-500 [&_svg]:text-warning-500 bg-transparent hover:bg-warning-50 dark:border-warning-400 dark:text-warning-400',
        'outline-danger':
          'border border-destructive text-destructive [&_svg]:text-destructive bg-transparent hover:bg-destructive/10 dark:border-destructive-400 dark:text-destructive-400',
        'outline-slate':
          'border border-slate-200 text-slate-500 [&_svg]:text-slate-500 bg-transparent hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400',

        success:
          'bg-success-500 text-success-foreground [&_svg]:text-success-foreground hover:bg-success-600 dark:bg-success-600 dark:hover:bg-success-700',
        warning:
          'bg-warning-500 text-warning-foreground [&_svg]:text-warning-foreground hover:bg-warning-600 dark:bg-warning-600 dark:hover:bg-warning-700',
        slate:
          'bg-slate-100 text-slate-600 [&_svg]:text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600',

        blue: 'bg-blue-600 text-white [&_svg]:text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
        indigo:
          'bg-indigo-600 text-white [&_svg]:text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
        purple:
          'bg-purple-600 text-white [&_svg]:text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600',
        pink: 'bg-pink-600 text-white [&_svg]:text-white hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600',
        rose: 'bg-rose-600 text-white [&_svg]:text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600',
        orange:
          'bg-orange-600 text-white [&_svg]:text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600',
        yellow:
          'bg-yellow-500 text-white [&_svg]:text-white hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500',
        green:
          'bg-green-600 text-white [&_svg]:text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
        teal: 'bg-teal-600 text-white [&_svg]:text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600',
        cyan: 'bg-cyan-600 text-white [&_svg]:text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600',

        editor:
          'bg-transparent text-editor-toolbar-foreground [&_svg]:text-editor-toolbar-foreground hover:bg-secondary size-8 p-0 dark:text-slate-300 dark:hover:bg-slate-800',
        unstyle:
          'bg-transparent text-slate-500 [&_svg]:text-slate-500 hover:opacity-80 shadow-none dark:text-slate-400'
      },
      size: {
        xs: 'h-6 min-w-6 px-1.5 py-0.5 rounded-md text-xs [&_svg]:size-3',
        sm: 'h-8 min-w-8 px-2.5 py-1 rounded-md text-xs [&_svg]:size-3.5',
        md: 'h-9 min-w-9 px-3.5 py-1.5 rounded-md text-sm',
        lg: 'h-10 min-w-10 px-4 py-2 rounded-lg text-sm [&_svg]:size-4.5',
        xl: 'h-12 min-w-12 px-5 py-2.5 rounded-lg text-base [&_svg]:size-5',
        icon: 'size-9 p-0 rounded-full',
        ratio: 'px-2.5 py-1.5 rounded-md text-xs',
        editorIcon: 'size-8 p-0 rounded-md'
      },
      isActive: {
        true: 'bg-editor-toolbar-active text-editor-toolbar-active-foreground [&_svg]:text-editor-toolbar-active-foreground dark:bg-slate-700 dark:text-white',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      isActive: false
    }
  }
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Whether to render the component as its children */
  asChild?: boolean;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** @deprecated Use isLoading instead */
  loading?: boolean;
  /** Icon to show before the button text */
  startIcon?: React.ReactNode;
  /** Icon to show after the button text */
  endIcon?: React.ReactNode;
  /** @deprecated Use startIcon instead */
  prependIcon?: React.ReactNode;
  /** @deprecated Use endIcon instead */
  appendIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isActive,
      type = 'button',
      isLoading = false,
      loading = false,
      disabled = false,
      startIcon,
      endIcon,
      prependIcon,
      appendIcon,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isLoadingState = isLoading || loading;
    const isDisabled = disabled || isLoadingState;
    const effectiveStartIcon = startIcon || prependIcon;
    const effectiveEndIcon = endIcon || appendIcon;

    return (
      <Comp
        type={type}
        className={cn(buttonVariants({ variant, size, isActive }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        data-disabled={isDisabled || undefined}
        data-loading={isLoadingState || undefined}
        ref={ref}
        {...props}
      >
        {isLoadingState ? (
          <Icons name='IconLoader2' className='mr-1.5 animate-spin' aria-hidden='true' />
        ) : (
          effectiveStartIcon && (
            <span className='mr-1.5 inline-flex items-center justify-center'>
              {effectiveStartIcon}
            </span>
          )
        )}
        {children}
        {effectiveEndIcon && !isLoadingState && (
          <span className='ml-1.5 inline-flex items-center justify-center'>{effectiveEndIcon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
