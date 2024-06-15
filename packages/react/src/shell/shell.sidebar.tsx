import React, { HtmlHTMLAttributes, memo } from 'react';

import { cn } from '@ncobase/utils';

import { useShellContext } from './shell.context';

interface IProps extends React.PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>> {}

const defaultStyling =
  'fixed top-0 bottom-0 left-0 z-[998] flex flex-shrink-0 min-w-14 bg-white shadow-[1px_0_2px_0_rgba(0,0,0,0.03)]';

export const ShellSidebar: React.FC<IProps> = memo(({ children, className, ...rest }) => {
  if (!children) return null;
  const { header } = useShellContext();
  const classes = cn(
    defaultStyling,
    // show header
    { 'top-14': !!header },
    className
  );
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
});
