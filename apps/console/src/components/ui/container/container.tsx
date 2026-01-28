import React from 'react';

import { cn } from '@ncobase/utils';

export interface ContainerProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  size?: string | number;
}

export const Container: React.FC<ContainerProps> = ({ className, size = 'full', ...rest }) => {
  const baseClasses = 'flex flex-col overflow-y-auto mx-auto p-4';

  const getClasses = () => {
    if (size === 'full') {
      return `${baseClasses} w-full`;
    }

    if (size && size !== '') {
      return `${baseClasses} max-w-${size}`;
    }

    return `${baseClasses} container`;
  };

  const classes = cn(getClasses(), className);

  return <div className={classes} {...rest} />;
};
