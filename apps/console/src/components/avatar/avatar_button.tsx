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
  ({ isLoading, className, ...rest }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center size-[1.75rem] font-medium rounded-full bg-slate-50',
      className
    );
    return (
      <div ref={ref}>
        {rest.src ? (
          <img src={rest.src} title={rest.title} alt={rest.alt} className={classes} />
        ) : (
          <span className={classes} {...rest}>
            {isLoading ? <Icons name='IconLoader' /> : getInitials(rest.title || rest.alt)}
          </span>
        )}
      </div>
    );
  }
);
