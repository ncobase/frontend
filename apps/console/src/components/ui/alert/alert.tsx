import React from 'react';

import { cn } from '@ncobase/utils';
import { VariantProps } from 'class-variance-authority';

import { alertVariants, AlertRoot, AlertDescription, AlertTitle } from './alert.elements';

interface AlertViewProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  /**
   * Alert title
   */
  title?: string;
  /**
   * Alert description
   */
  description?: string;
  /**
   * Alert children elements
   */
  children?: React.ReactNode;
  /**
   * Icon to display in the alert
   */
  icon?: React.ReactNode;
  /**
   * Alert className
   */
  className?: string;
}

export const Alert: React.FC<AlertViewProps> = ({
  title,
  description,
  children,
  icon,
  className,
  variant,
  ...props
}) => {
  return (
    <AlertRoot className={cn(className)} variant={variant} {...props}>
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
      {children}
    </AlertRoot>
  );
};
