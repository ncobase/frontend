import React from 'react';

import { cn } from '@ncobase/utils';

import { getButtonStyling, getIconStyling, TButtonSizes, TButtonVariant } from './styles';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TButtonVariant;
  size?: TButtonSizes;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  appendIcon?: any;
  prependIcon?: any;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button',
    loading = false,
    disabled = false,
    prependIcon = null,
    appendIcon = null,
    children,
    ...rest
  } = props;

  const buttonStyle = getButtonStyling(variant, size, disabled || loading);
  const buttonIconStyle = getIconStyling(size);

  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonStyle, className)}
      disabled={disabled || loading}
      {...rest}
    >
      {prependIcon && <div className={buttonIconStyle}>{React.cloneElement(prependIcon)}</div>}
      {children}
      {appendIcon && <div className={buttonIconStyle}>{React.cloneElement(appendIcon)}</div>}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
