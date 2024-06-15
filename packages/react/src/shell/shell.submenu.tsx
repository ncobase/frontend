import React, { HtmlHTMLAttributes, memo } from 'react';

import { cn } from '@ncobase/utils';

import { useShellContext } from './shell.context';

interface IProps extends React.PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>> {}

const defaultStyling =
  'fixed top-0 bottom-0 left-0 z-[996] flex flex-shrink-0 flex-col min-w-36 max-w-36 bg-white shadow-[1px_0_2px_0_rgba(0,0,0,0.03)]';

export const ShellSubmenu: React.FC<IProps> = memo(({ children, className, ...rest }) => {
  if (!children) return null;
  const { header, sidebar, topbar } = useShellContext();
  const classes = cn(
    defaultStyling,
    // show sidebar
    { 'left-14': !!sidebar },
    // show header && show topbar
    { 'top-[6.5rem]': !!header && !!topbar },
    // hide header && show topbar
    { 'top-12': !header && !!topbar },
    // show header && hide topbar
    { 'top-14': !!header && !topbar },
    className
  );
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
});
