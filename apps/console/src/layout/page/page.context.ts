import React, { createContext, useContext } from 'react';

import { Menu } from '@ncobase/types';

/**
 * @see Page
 * @see PageProps
 */
interface PageContextValue {
  /**
   * set page used layout or not
   * @param layout {boolean}
   */
  layout?: boolean;
  /**
   * set page show header or not
   * @param header {boolean}
   */
  header?: boolean;
  /**
   * set page show topbar or not
   * @param topbar {React.ReactNode | React.ReactElement}
   */
  topbar?: React.ReactNode | React.ReactElement;
  /**
   * set page show sidebar or not
   * @param sidebar {React.ReactNode | React.ReactElement | null}
   */
  sidebar?: React.ReactNode | React.ReactElement | null;
  /**
   * set page show submenu or not
   * @param submenu {boolean}
   */
  submenu?: boolean;
  /**
   * set page menus
   * @param menus {Menu[]}
   */
  menus?: Menu[];
  /**
   * set page menus
   * @param menus {Menu[]}
   */
  setMenus?: (menus: Menu[]) => void;
}

/**
 * @see Page
 */
export const PageContext = createContext<PageContextValue>({});

/**
 * @see Page
 * @returns {PageContextValue}
 */
export const usePageContext = (): PageContextValue => useContext(PageContext);

/**
 * get page is used layout or not
 * @returns {boolean}
 */
export const useLayout = (): boolean => {
  const { layout } = usePageContext();
  return layout;
};

/**
 * get page is used header or not
 * @returns {boolean}
 */
export const useHeader = (): boolean => {
  const { header } = usePageContext();
  return header;
};

/**
 * get page is used topbar or not
 * @returns {React.ReactNode | React.ReactElement | null}
 */
export const useTopbar = (): React.ReactNode | React.ReactElement | null => {
  const { topbar } = usePageContext();
  return topbar;
};

/**
 * get page is used sidebar or not
 * @returns {React.ReactNode | React.ReactElement | null}
 */
export const useSidebar = (): React.ReactNode | React.ReactElement | null => {
  const { sidebar } = usePageContext();
  return sidebar;
};

/**
 * get page is used submenu or not
 *
 */
export const useMenus = (): [Menu[], (menus: Menu[]) => void] => {
  const { menus, setMenus } = usePageContext();
  if (!setMenus) {
    throw new Error('setMenus function is not provided');
  }
  return [menus, setMenus];
};
