import { createContext, useContext } from 'react';

import { NavigationMenus, MenuTree } from '@/features/system/menu/menu';
export type { NavigationMenus } from '@/features/system/menu/menu';

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
}

const defaultValue: LayoutContextValue = {
  isFocusMode: false,
  setIsFocusMode: undefined
};

export const LayoutContext = createContext<LayoutContextValue>(defaultValue);

export const useLayoutContext = () => useContext(LayoutContext);
