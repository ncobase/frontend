import React from 'react';

import { Icons } from '@ncobase/react';
import { cn, getInitials } from '@ncobase/utils';

interface AvatarButtonProps {
  isLoading?: boolean;
  onClick?: () => void;
  title?: string;
  alt?: string;
  src?: string;
  className?: string;
}

export const AvatarButton = React.forwardRef<HTMLDivElement, AvatarButtonProps>(
  ({ isLoading, className, src, title, alt, ...rest }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center size-[1.75rem] font-medium rounded-full bg-slate-50 dark:bg-slate-800 dark:text-slate-200',
      className
    );
    const shouldRenderImage = src && src.trim() !== '';
    return (
      <div ref={ref}>
        {shouldRenderImage ? (
          <img src={src} title={title} alt={alt} className={classes} />
        ) : (
          <span className={classes} {...rest}>
            {isLoading ? <Icons name='IconLoader' /> : getInitials(title || alt)}
          </span>
        )}
      </div>
    );
  }
);
