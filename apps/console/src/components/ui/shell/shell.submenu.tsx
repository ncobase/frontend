import React, { type HtmlHTMLAttributes, memo } from 'react';

import { cn } from '@ncobase/utils';

import { useShellContext } from './shell.context';

interface IProps extends React.PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>> {
  /** Accessibility role, defaults to 'navigation' */
  role?: string;
}

const defaultStyling =
  'fixed top-0 bottom-0 z-995 flex shrink-0 flex-col min-w-36 max-w-36 bg-white shadow-[1px_0_2px_0_rgba(0,0,0,0.03)]';

// Calculate positions based on all components
const getPositioningClasses = (
  direction?: 'ltr' | 'rtl',
  sidebar?: React.ReactNode | undefined,
  sidebarExpanded?: boolean,
  header?: React.ReactNode | undefined,
  tabbar?: React.ReactNode | undefined,
  topbar?: React.ReactNode | undefined
) => {
  const classes = [];

  // Handle horizontal positioning with RTL support
  if (direction === 'rtl') {
    classes.push('right-0');
    if (!!sidebar && !sidebarExpanded) classes.push('right-[3.5rem]');
    if (!!sidebar && sidebarExpanded) classes.push('right-[9.5rem]');
  } else {
    classes.push('left-0');
    if (!!sidebar && !sidebarExpanded) classes.push('left-[3.5rem]');
    if (!!sidebar && sidebarExpanded) classes.push('left-[9.5rem]');
  }

  // Handle vertical positioning - stack all components
  if (!!header && !!tabbar && !!topbar) classes.push('top-[8.75rem]'); // header + tabbar + topbar
  if (!!header && !!tabbar && !topbar) classes.push('top-[5.75rem]'); // header + tabbar
  if (!!header && !tabbar && !!topbar) classes.push('top-[6.5rem]'); // header + topbar
  if (!header && !!tabbar && !!topbar) classes.push('top-[5.25rem]'); // tabbar + topbar
  if (!!header && !tabbar && !topbar) classes.push('top-[3.5rem]'); // header only
  if (!header && !!tabbar && !topbar) classes.push('top-[2.25rem]'); // tabbar only
  if (!header && !tabbar && !!topbar) classes.push('top-[3rem]'); // topbar only

  return classes;
};

export const ShellSubmenu: React.FC<IProps> = memo(
  ({ children, className, role = 'navigation', ...rest }) => {
    if (!children) return null;

    const { header, tabbar, topbar, sidebar, sidebarExpanded, direction } = useShellContext();

    const positioningClasses = getPositioningClasses(
      direction,
      sidebar,
      sidebarExpanded,
      header,
      tabbar,
      topbar
    );

    const classes = cn(defaultStyling, positioningClasses, className);

    return (
      <div className={classes} role={role} aria-label='Sub navigation' {...rest}>
        {children}
      </div>
    );
  }
);
