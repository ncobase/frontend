import React, { type HtmlHTMLAttributes, memo } from 'react';

import { cn } from '@ncobase/utils';

import { useShellContext } from './shell.context';

interface IProps extends React.PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>> {
  /** Accessibility role, defaults to 'complementary' */
  role?: string;
}

const defaultStyling =
  'fixed top-0 z-996 flex shrink-0 min-h-12 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]';

// Direction-based positioning
const getPositioningClasses = (
  direction?: 'ltr' | 'rtl',
  sidebar?: React.ReactNode | undefined,
  sidebarExpanded?: boolean,
  header?: React.ReactNode | undefined,
  tabbar?: React.ReactNode | undefined
) => {
  const classes = [];

  if (direction === 'rtl') {
    classes.push('right-0 left-0');
    if (!!sidebar && !sidebarExpanded) classes.push('right-[3.5rem]'); // show sidebar && sidebar collapsed
    if (!!sidebar && sidebarExpanded) classes.push('right-[9.5rem]'); // show sidebar && sidebar expanded
  } else {
    classes.push('left-0 right-0');
    if (!!sidebar && !sidebarExpanded) classes.push('left-[3.5rem]'); // show sidebar && sidebar collapsed
    if (!!sidebar && sidebarExpanded) classes.push('left-[9.5rem]'); // show sidebar && sidebar expanded
  }

  // Vertical positioning
  if (!!header && !!tabbar) classes.push('top-[5.75rem]'); // header(3.5rem) + tabbar(2.25rem)
  if (!!header && !tabbar) classes.push('top-[3.5rem]'); // header only
  if (!header && !!tabbar) classes.push('top-[2.25rem]'); // tabbar only
  if (!header && !tabbar) classes.push('top-0'); // neither

  return classes;
};

export const ShellTopbar: React.FC<IProps> = memo(
  ({ children, className, role = 'complementary', ...rest }) => {
    if (!children) return null;

    const { header, tabbar, sidebar, sidebarExpanded, direction } = useShellContext();

    const positioningClasses = getPositioningClasses(
      direction,
      sidebar,
      sidebarExpanded,
      header,
      tabbar
    );

    const classes = cn(defaultStyling, positioningClasses, className);

    return (
      <div className={classes} role={role} {...rest}>
        {children}
      </div>
    );
  }
);
