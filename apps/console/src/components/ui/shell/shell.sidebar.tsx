import React, { type HtmlHTMLAttributes, memo } from 'react';

import { cn } from '@ncobase/utils';

import { useShellContext } from './shell.context';

interface IProps extends React.PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>> {
  /** Element ID for accessibility */
  navId?: string;
}

const defaultStyling =
  'fixed top-0 bottom-0 z-998 flex shrink-0 bg-white shadow-[1px_0_2px_0_rgba(0,0,0,0.03)]';

export const ShellSidebar: React.FC<IProps> = memo(
  ({ children, className, navId = 'main-sidebar', ...rest }) => {
    if (!children) return null;

    const { header, sidebar, sidebarExpanded, direction } = useShellContext();

    const classes = cn(
      defaultStyling,
      // Direction-based positioning
      direction === 'rtl' ? 'right-0' : 'left-0',
      { 'top-[3.5rem]': !!header }, // show header
      // Sidebar expanded state
      { 'min-w-[3.5rem]': !!sidebar && !sidebarExpanded }, // show sidebar && sidebar collapsed
      { 'min-w-[9.5rem]': !!sidebar && sidebarExpanded }, // show sidebar && sidebar expanded
      className
    );

    return (
      <div className={classes} role='navigation' aria-label='Main navigation' id={navId} {...rest}>
        {children}
      </div>
    );
  }
);
