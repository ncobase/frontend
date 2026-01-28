import React from 'react';

import { cn } from '@ncobase/utils';
import * as TIcons from '@tabler/icons-react';

interface IProps extends TIcons.IconProps {
  name: keyof typeof TIcons | string | undefined;
}

export const TablerIconsNamespace = TIcons['icons'];

export const Icons: React.FC<IProps> = ({
  name = '',
  size = 16,
  stroke = 1.5,
  className,
  ...rest
}) => {
  const IconComponent = name
    ? (TIcons[name as keyof typeof TIcons] as React.FC<TIcons.IconProps>)
    : null;

  if (!IconComponent) {
    return null;
  }

  const isFilled = name.endsWith('Filled');
  const classes = cn(
    'inline-block',
    {
      // Inherit text color if text color classes are present
      'current-color': className?.includes('text-'),
      // Default color styles if no text color class provided
      'stroke-current text-slate-500/80': !className?.includes('text-'),
      // Filled icon styles
      'stroke-0 stroke-none fill-current': isFilled
    },
    className
  );

  return (
    <IconComponent size={size} strokeWidth={isFilled ? 0 : stroke} className={classes} {...rest} />
  );
};
