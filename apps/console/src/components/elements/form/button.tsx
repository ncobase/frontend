import { forwardRef } from 'react';

import {
  Button as StdButton,
  ButtonProps,
  Icons,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@ncobase/react';
import { cn } from '@ncobase/utils';

interface Props extends ButtonProps {
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  icon?: string;
}

export const Button: React.FC<Props> = forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      variant = 'unstyle',
      size = 'ratio',
      tooltip,
      tooltipPosition = 'bottom',
      onClick,
      icon,
      ...rest
    },
    ref
  ) => {
    const classes = cn('inline-flex items-center justify-center', className);
    const buttonContent = (
      <>
        {icon && <Icons name={icon} />}
        {rest.children}
      </>
    );
    const button = (
      <StdButton
        ref={ref}
        type='button'
        variant={variant}
        size={size}
        className={classes}
        onClick={onClick}
        {...rest}
      >
        {buttonContent}
      </StdButton>
    );
    if (!tooltip) return button;
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipPosition}>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }
);
