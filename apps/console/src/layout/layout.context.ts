import React, { createContext, useContext } from 'react';

import { Menu } from '@/types';

export interface LayoutContextValue {
  /**
   * page view mode
   */
  vmode?: 'default' | 'modal' | 'side' | 'fullscreen';
  /**
   * set page view mode
   * @param vmode page view mode
   * @returns {void}
   */
  setVmode?: (vmode: 'default' | 'modal' | 'side' | 'fullscreen') => void;
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
  /**
   * focus mode
   */
  isFocusMode: boolean;
  /**
   * set focus mode
   * @param isFocusMode focus mode
   */
  setIsFocusMode: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}

const defaultValue: LayoutContextValue = {
  vmode: 'default',
  isFocusMode: false,
  setIsFocusMode: undefined
};

export const LayoutContext = createContext<LayoutContextValue>(defaultValue);

export const useLayoutContext = () => useContext(LayoutContext);
