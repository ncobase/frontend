import { createContext, useContext } from 'react';

import { NavigationMenus, MenuTree } from '@/features/system/menu/menu';
export type { MenuTree, NavigationMenus };

/**
 * Tab navigation item type
 */
export interface TabItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  closable?: boolean;
  component?: React.ReactNode;
  active?: boolean;
}

export interface LayoutContextValue {
  /**
   * page view mode
   */
  vmode?: 'modal' | 'flatten';
  /**
   * set page view mode
   */
  setVmode?: (_vmode: 'modal' | 'flatten') => void;
  /**
   * grouped navigation menus
   */
  navigationMenus?: NavigationMenus;
  /**
   * set grouped navigation menus
   */
  setNavigationMenus?: (_groups: NavigationMenus) => void;
  /**
   * all menus flattened
   */
  menus?: MenuTree[];
  /**
   * set all menus
   */
  setMenus?: (_menus: MenuTree[]) => void;
  /**
   * focus mode
   */
  isFocusMode: boolean;
  /**
   * set focus mode
   */
  setIsFocusMode: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  /**
   * tabs navigation enabled
   */
  tabsEnabled?: boolean;
  /**
   * set tabs navigation enabled
   */
  setTabsEnabled?: (_enabled: boolean) => void;
  /**
   * tabs navigation
   */
  tabs?: TabItem[];
  /**
   * set tabs navigation
   */
  setTabs?: (_tabs: TabItem[]) => void;
  /**
   * active tab id
   */
  activeTabId?: string;
  /**
   * set active tab id
   */
  setActiveTabId?: (_id: string) => void;
  /**
   * add tab navigation
   */
  addTab?: (_tab: TabItem) => void;
  /**
   * remove tab navigation
   */
  removeTab?: (_id: string) => void;
  /**
   * update tab navigation
   */
  updateTab?: (_id: string, _updates: Partial<TabItem>) => void;
  /**
   * close tab navigation
   */
  closeOtherTabs?: (_id: string) => void;
  /**
   * close all tabs navigation
   */
  closeAllTabs?: () => void;
}

const defaultValue: LayoutContextValue = {
  isFocusMode: false,
  setIsFocusMode: undefined
};

export const LayoutContext = createContext<LayoutContextValue>(defaultValue);

export const useLayoutContext = () => useContext(LayoutContext);
