import React, { ReactNode, memo } from 'react';

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
  /** main area className */
  className?: string;
}

const defaultStyling = 'relative flex h-lvh overflow-hidden';

export const Shell: React.FC<IProps> = memo(
  ({ children, header, sidebar, topbar, submenu, className, ...rest }) => {
    const mainClassName = cn(
      defaultStyling,
      {
        // header and topbar conditions
        'pt-14': !!header && !topbar, // show header && hide topbar
        'pt-12': !header && !!topbar, // show topbar && hide header
        'pt-[6.5rem]': !!header && !!topbar, // show header && show topbar
        // sidebar and submenu conditions
        'pl-14': !!sidebar && !submenu, // show sidebar && hide submenu
        'pl-36': !sidebar && !!submenu, // show submenu && hide sidebar
        'pl-[12.5rem]': !!sidebar && !!submenu // show sidebar && show submenu
      },
      className
    );

    return (
      <ShellContext.Provider value={{ header, sidebar, topbar, submenu }}>
        {header}
        <div className={mainClassName} {...rest}>
          {sidebar}
          {topbar}
          {submenu}
          {children}
        </div>
      </ShellContext.Provider>
    );
  }
);
