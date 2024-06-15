import React from 'react';

import { cn } from '@ncobase/utils';

export type TSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  size?: TSizes | string | number;
}

export const Container: React.FC<ContainerProps> = ({ className, size = 'full', ...rest }) => {
  const classes = cn(
    'flex flex-col overflow-y-auto container mx-auto p-4',
    `max-w-${[size]}`,
    className
  );

  return <div className={classes} {...rest} />;
};
