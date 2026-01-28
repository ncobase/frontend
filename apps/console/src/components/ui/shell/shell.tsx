import React, { memo, type ReactNode, useMemo } from 'react';

import { cn } from '@ncobase/utils';

import { ShellContext } from './shell.context';

interface IProps extends React.PropsWithChildren {
  /** <Header /> component */
  header?: ReactNode;
  /** <Sidebar /> component */
  sidebar?: ReactNode;
  /** <Topbar /> component */
  topbar?: ReactNode;
  /** <Submenu /> component */
  submenu?: ReactNode;
  /** <TabBar /> component */
  tabbar?: ReactNode;
  /** main area className */
  className?: string;
  /** Sidebar expanded state */
  sidebarExpanded?: boolean;
  /** Layout direction: 'ltr' | 'rtl' */
  direction?: 'ltr' | 'rtl';
}

const defaultStyling = 'relative flex h-lvh overflow-hidden';

// Calculate padding classes
const getLayoutClasses = (
  header: ReactNode | undefined,
  tabbar: ReactNode | undefined,
  topbar: ReactNode | undefined,
  sidebar: ReactNode | undefined,
  submenu: ReactNode | undefined,
  sidebarExpanded: boolean,
  direction: 'ltr' | 'rtl'
) => {
  const classes: Record<string, boolean> = {};

  // Vertical padding - stack header, tabbar, topbar
  if (!!header && !!tabbar && !!topbar) classes['pt-[8.75rem]'] = true; // 3.5 + 2.25 + 3 = 8.75rem
  if (!!header && !!tabbar && !topbar) classes['pt-[5.75rem]'] = true; // 3.5 + 2.25 = 5.75rem
  if (!!header && !tabbar && !!topbar) classes['pt-[6.5rem]'] = true; // 3.5 + 3 = 6.5rem
  if (!header && !!tabbar && !!topbar) classes['pt-[5.25rem]'] = true; // 2.25 + 3 = 5.25rem
  if (!!header && !tabbar && !topbar) classes['pt-[3.5rem]'] = true; // header only
  if (!header && !!tabbar && !topbar) classes['pt-[2.25rem]'] = true; // tabbar only
  if (!header && !tabbar && !!topbar) classes['pt-[3rem]'] = true; // topbar only

  // Sidebar and submenu padding
  if (direction === 'ltr') {
    if (!!sidebar && !submenu && !sidebarExpanded) classes['pl-[3.5rem]'] = true; // show sidebar && hide submenu && sidebar collapsed
    if (!!sidebar && !submenu && sidebarExpanded) classes['pl-[9.5rem]'] = true; // show sidebar && hide submenu && sidebar expanded
    if (!sidebar && !!submenu && !sidebarExpanded) classes['pl-[9rem]'] = true; // hide sidebar && show submenu && sidebar collapsed
    if (!sidebar && !!submenu && sidebarExpanded) classes['pl-[14rem]'] = true; // hide sidebar && show submenu && sidebar expanded
    if (!!sidebar && !!submenu && !sidebarExpanded) classes['pl-[12.5rem]'] = true; // show sidebar && show submenu && sidebar collapsed
    if (!!sidebar && !!submenu && sidebarExpanded) classes['pl-[19rem]'] = true; // show sidebar && show submenu && sidebar expanded
  } else {
    if (!!sidebar && !submenu && !sidebarExpanded) classes['pr-[3.5rem]'] = true; // show sidebar && hide submenu && sidebar collapsed
    if (!!sidebar && !submenu && sidebarExpanded) classes['pr-[9.5rem]'] = true; // show sidebar && hide submenu && sidebar expanded
    if (!sidebar && !!submenu && !sidebarExpanded) classes['pr-[9rem]'] = true; // hide sidebar && show submenu && sidebar collapsed
    if (!sidebar && !!submenu && sidebarExpanded) classes['pr-[14rem]'] = true; // hide sidebar && show submenu && sidebar expanded
    if (!!sidebar && !!submenu && !sidebarExpanded) classes['pr-[12.5rem]'] = true; // show sidebar && show submenu && sidebar collapsed
    if (!!sidebar && !!submenu && sidebarExpanded) classes['pr-[19rem]'] = true; // show sidebar && show submenu && sidebar expanded
  }

  return classes;
};

export const Shell: React.FC<IProps> = memo(
  ({
    children,
    header,
    sidebar,
    topbar,
    submenu,
    tabbar,
    className,
    sidebarExpanded = false,
    direction = 'ltr',
    ...rest
  }) => {
    const layoutClasses = useMemo(
      () => getLayoutClasses(header, tabbar, topbar, sidebar, submenu, sidebarExpanded, direction),
      [header, tabbar, topbar, sidebar, submenu, sidebarExpanded, direction]
    );

    const mainClassName = cn(defaultStyling, layoutClasses, className);

    const contextValue = useMemo(
      () => ({ header, sidebar, topbar, submenu, tabbar, sidebarExpanded, direction }),
      [header, sidebar, topbar, submenu, tabbar, sidebarExpanded, direction]
    );

    return (
      <ShellContext.Provider value={contextValue}>
        {header}
        <div className={mainClassName} {...rest} dir={direction} role='main'>
          {sidebar}
          {tabbar}
          {topbar}
          {submenu}
          {children}
        </div>
      </ShellContext.Provider>
    );
  }
);
