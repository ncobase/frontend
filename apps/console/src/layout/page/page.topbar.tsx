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
}

const TopbarWrapper: React.FC<TopbarProps> = ({ children, className }) => {
  return (
    <ShellTopbar className={cn('px-4 align-middle flex items-center justify-between', className)}>
      {children}
    </ShellTopbar>
  );
};

const TopbarComponent: React.FC<TopbarProps> = ({
  title,
  left = [],
  right = [],
  children,
  className
}) => {
  if (children) return <TopbarWrapper className={className}>{children}</TopbarWrapper>;
  return (
    <TopbarWrapper className={className}>
      {title && (
        <div className='text-base font-medium text-slate-600'>
          {title}
          {(!!left.length || !!right.length) && (
            <span className='pl-px ml-4 mr-3 w-px bg-slate-200' />
          )}
        </div>
      )}
      {!!left.length && (
        <div className='flex gap-2'>
          {left.map((element, index) => (
            <React.Fragment key={index}>{element}</React.Fragment>
          ))}
        </div>
      )}
      {!!right.length && (
        <div className='grow flex justify-end items-center gap-2'>
          {right.map((element, index) => (
            <React.Fragment key={index}>{element}</React.Fragment>
          ))}
        </div>
      )}
    </TopbarWrapper>
  );
};

export const Topbar = React.memo(TopbarComponent);
