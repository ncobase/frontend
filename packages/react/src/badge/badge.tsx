import React from 'react';

import { cn } from '@ncobase/utils';

import { TBadgeSize, TBadgeVariant, getBadgeStyle } from './styles';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TBadgeVariant;
  size?: TBadgeSize;
  className?: string;
  children?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
  const { variant = 'primary', size = 'md', className = '', ...rest } = props;
  const badgeStyle = getBadgeStyle(variant, size);

  return (
    <div
      ref={ref}
      className={cn(badgeStyle, className, rest?.children && 'w-auto h-auto px-[6px] py-0')}
      {...rest}
    />
  );
});

Badge.displayName = 'Badge';

export { Badge };
