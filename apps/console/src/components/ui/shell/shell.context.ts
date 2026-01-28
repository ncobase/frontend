import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface ShellContextValue {
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
  /** Sidebar expanded state */
  sidebarExpanded?: boolean;
  /** Layout direction: 'ltr' | 'rtl' */
  direction?: 'ltr' | 'rtl';
}

const defaultValue: ShellContextValue = {};

export const ShellContext = createContext<ShellContextValue>(defaultValue);

export const useShellContext = () => useContext(ShellContext);
