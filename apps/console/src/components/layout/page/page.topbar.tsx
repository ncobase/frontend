import React from 'react';

import { ShellTopbar } from '@ncobase/react';
import { cn } from '@ncobase/utils';

export interface TopbarProps {
  /** The title of the topbar */
  title?: string | React.ReactNode;
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
  /**
   * The children of the topbar
   */
  children?: React.ReactNode;
  /**
   * The class name of the topbar
   */
  className?: string;
}

const TopbarWrapper: React.FC<
  React.PropsWithChildren<{
    className?: string;
    ariaLabel?: string;
  }>
> = ({ children, className, ariaLabel = 'Page toolbar' }) => {
  return (
    <ShellTopbar
      className={cn(
        'px-4 align-middle flex items-center justify-between',
        'backdrop-blur-sm bg-white/80 dark:bg-slate-900/80',
        'border-b border-slate-200/80 dark:border-slate-700/80',
        'transition-colors duration-200',
        className
      )}
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
        <div
          className={cn(
            'font-medium shrink-0',
            'text-slate-700 dark:text-slate-200',
            'transition-colors duration-200'
          )}
          id='topbar-title'
        >
          {React.isValidElement(title) ? (
            title
          ) : (
            <>
              {title}
              {(!!left.length || !!right.length) && (
                <span
                  className={cn(
                    'pl-px ml-4 mr-3 w-px',
                    'bg-slate-200/80 dark:bg-slate-700/80',
                    'transition-colors duration-200'
                  )}
                  aria-hidden='true'
                />
              )}
            </>
          )}
        </div>
      )}

      {!!left.length && (
        <div
          className={cn('flex gap-2 shrink-0 mr-auto', 'transition-colors duration-200')}
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
          className={cn(
            'grow flex justify-end items-center gap-2 shrink-0 ml-auto',
            'transition-colors duration-200'
          )}
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
