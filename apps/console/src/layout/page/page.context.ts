import { createContext, useContext } from 'react';

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
 * @returns {React.ReactNode | React.ReactElement}
 */
export const useTopbar = (): React.ReactNode | React.ReactElement => {
  const { topbar } = usePageContext();
  return topbar;
};

/**
 * get page is used sidebar or not
 * @returns {React.ReactNode | React.ReactElement}
 */
export const useSidebar = (): React.ReactNode | React.ReactElement => {
  const { sidebar } = usePageContext();
  return sidebar;
};

/**
 * get page is used submenu or not
 * @returns {React.ReactNode | React.ReactElement}
 */
export const useSubmenu = (): React.ReactNode | React.ReactElement => {
  const { submenu } = usePageContext();
  return submenu;
};
