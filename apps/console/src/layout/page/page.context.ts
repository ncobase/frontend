import { createContext, useContext } from 'react';

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
   * @param sidebar {React.ReactNode | React.ReactElement}
   */
  sidebar?: React.ReactNode | React.ReactElement;
  /**
   * set page show submenu or not
   * @param submenu {React.ReactNode | React.ReactElement}
   */
  submenu?: React.ReactNode | React.ReactElement;
  /**
   * header menus
   * @param menus {Menu[]}
   */
  headerMenus?: Menu[];
  /**
   * set header menus
   * @param menus {Menu[]}
   */
  setHeaderMenus?: (menus: Menu[]) => void;
  sidebarMenus?: Menu[];
  setSidebarMenus?: (menus: Menu[]) => void;
  submenus?: Menu[];
  setSubmenus?: (menus: Menu[]) => void;
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
 * set page layout or not
 * @param layout {boolean}
 */
export const setLayout = (layout: boolean) => {
  const pageContext = usePageContext();
  pageContext.layout = layout;
};

/**
 * get page is used layout or not
 * @returns {boolean}
 */
export const useLayout = (): boolean => {
  const pageContext = usePageContext();
  return pageContext.layout || false;
};

/**
 * set page header or not
 * @param header {boolean}
 */
export const setHeader = (header: boolean) => {
  const pageContext = usePageContext();
  pageContext.header = header;
};
/**
 * get page is used header or not
 * @returns {boolean}
 */
export const useHeader = (): boolean => {
  const pageContext = usePageContext();
  return pageContext.header || false;
};

/**
 * set page topbar or not
 * @param topbar {React.ReactNode | React.ReactElement}
 */
export const setTopbar = (topbar: React.ReactNode | React.ReactElement) => {
  const pageContext = usePageContext();
  pageContext.topbar = topbar;
};

/**
 * get page is used topbar or not
 * @returns {React.ReactNode | React.ReactElement}
 */
export const useTopbar = (): React.ReactNode | React.ReactElement => {
  const pageContext = usePageContext();
  return pageContext.topbar;
};

/**
 * set page sidebar or not
 * @param sidebar {React.ReactNode | React.ReactElement}
 */
export const setSidebar = (sidebar: React.ReactNode | React.ReactElement) => {
  const pageContext = usePageContext();
  pageContext.sidebar = sidebar;
};

/**
 * get page is used sidebar or not
 * @returns {React.ReactNode | React.ReactElement}
 */
export const useSidebar = (): React.ReactNode | React.ReactElement => {
  const pageContext = usePageContext();
  return pageContext.sidebar;
};

/**
 * set page submenu or not
 * @param submenu {React.ReactNode | React.ReactElement}
 */
export const setSubmenu = (submenu: React.ReactNode | React.ReactElement) => {
  const pageContext = usePageContext();
  pageContext.submenu = submenu;
};

/**
 * get page is used submenu or not
 * @returns {React.ReactNode | React.ReactElement}
 */
export const useSubmenu = (): React.ReactNode | React.ReactElement => {
  const pageContext = usePageContext();
  return pageContext.submenu;
};

/**
 * set page header menus
 * @param menus {Menu[]}
 */
export const setHeaderMenus = (menus: Menu[]) => {
  const pageContext = usePageContext();
  pageContext.headerMenus = menus;
};

/**
 * get page header menus
 * @returns {Menu[]}
 */
export const useHeaderMenus = (): Menu[] => {
  const pageContext = usePageContext();
  return pageContext.headerMenus || [];
};

/**
 * set page sidebar menus
 * @param menus {Menu[]}
 */
export const setSidebarMenus = (menus: Menu[]) => {
  const pageContext = usePageContext();
  pageContext.sidebarMenus = menus;
};

/**
 * get page sidebar menus
 * @returns {Menu[]}
 */
export const useSidebarMenus = (): Menu[] => {
  const pageContext = usePageContext();
  return pageContext.sidebarMenus || [];
};

/**
 * set page submenu menus
 * @param menus {Menu[]}
 */
export const setSubmenus = (menus: Menu[]) => {
  const pageContext = usePageContext();
  pageContext.submenus = menus;
};

/**
 * get page submenu menus
 * @returns {Menu[]}
 */
export const useSubmenuMenus = (): Menu[] => {
  const pageContext = usePageContext();
  return pageContext.submenus || [];
};
