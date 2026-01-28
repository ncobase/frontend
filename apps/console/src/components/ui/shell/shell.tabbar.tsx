import React, { type HtmlHTMLAttributes, memo } from 'react';

import { cn } from '@ncobase/utils';

import { useShellContext } from './shell.context';

interface IProps extends React.PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>> {
  /** Accessibility role, defaults to 'tablist' */
  role?: string;
}

const defaultStyling = 'fixed top-0 z-997 flex shrink-0 min-h-9 bg-white border-b border-gray-200';

// Calculate positioning - tabbar goes above topbar
const getPositioningClasses = (
  direction?: 'ltr' | 'rtl',
  sidebar?: React.ReactNode | undefined,
  sidebarExpanded?: boolean,
  header?: React.ReactNode | undefined
) => {
  const classes = [];

  // Handle horizontal positioning with RTL support
  if (direction === 'rtl') {
    classes.push('right-0 left-0');
    if (!!sidebar && !sidebarExpanded) classes.push('right-[3.5rem]');
    if (!!sidebar && sidebarExpanded) classes.push('right-[9.5rem]');
  } else {
    classes.push('left-0 right-0');
    if (!!sidebar && !sidebarExpanded) classes.push('left-[3.5rem]');
    if (!!sidebar && sidebarExpanded) classes.push('left-[9.5rem]');
  }

  // Handle vertical positioning - tabbar comes after header only
  if (header) classes.push('top-[3.5rem]'); // After header
  if (!header) classes.push('top-0'); // At top if no header

  return classes;
};

export const ShellTabBar: React.FC<IProps> = memo(
  ({ children, className, role = 'tablist', ...rest }) => {
    if (!children) return null;

    const { header, sidebar, sidebarExpanded, direction } = useShellContext();

    const positioningClasses = getPositioningClasses(direction, sidebar, sidebarExpanded, header);

    const classes = cn(defaultStyling, positioningClasses, className);

    return (
      <div className={classes} role={role} aria-label='Tab navigation' {...rest}>
        {children}
      </div>
    );
  }
);
