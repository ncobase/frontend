import React from 'react';

import { ShellTopbar } from '@ncobase/react';
import { cn } from '@ncobase/utils';

export interface TopbarProps extends React.ComponentProps<'div'> {
  /** The title of the topbar */
  title?: string;
  /**
   * The left side of the topbar
   * @type React.ReactNode[]
   */
  left?: React.ReactNode[];
  /**
   * The right side of the topbar
   * @type React.ReactNode[]
   * */
  right?: React.ReactNode[];
  /**
   * Accessibility label for the topbar
   */
  ariaLabel?: string;
}

const TopbarWrapper: React.FC<
  React.PropsWithChildren<{
    className?: string;
    ariaLabel?: string;
  }>
> = ({ children, className, ariaLabel = 'Page toolbar' }) => {
  return (
    <ShellTopbar
      className={cn('px-4 align-middle flex items-center justify-between', className)}
      role='toolbar'
      aria-label={ariaLabel}
    >
      {children}
    </ShellTopbar>
  );
};

const TopbarComponent: React.FC<TopbarProps> = ({
  title,
  left = [],
  right = [],
  children,
  className,
  ariaLabel
}) => {
  if (children) {
    return (
      <TopbarWrapper className={className} ariaLabel={ariaLabel}>
        {children}
      </TopbarWrapper>
    );
  }

  return (
    <TopbarWrapper className={className} ariaLabel={ariaLabel}>
      {title && (
        <div className='font-medium text-slate-600 shrink-0' id='topbar-title'>
          {title}
          {(!!left.length || !!right.length) && (
            <span className='pl-px ml-4 mr-3 w-px bg-slate-200' aria-hidden='true' />
          )}
        </div>
      )}

      {!!left.length && (
        <div
          className='flex gap-2 shrink-0 mr-auto'
          role='group'
          aria-labelledby={title ? 'topbar-title' : undefined}
        >
          {left.map((element, index) => (
            <React.Fragment key={index}>{element}</React.Fragment>
          ))}
        </div>
      )}

      {!!right.length && (
        <div
          className='grow flex justify-end items-center gap-2 shrink-0 ml-auto'
          role='group'
          aria-label='Actions'
        >
          {right.map((element, index) => (
            <React.Fragment key={index}>{element}</React.Fragment>
          ))}
        </div>
      )}
    </TopbarWrapper>
  );
};

export const Topbar = React.memo(TopbarComponent);
