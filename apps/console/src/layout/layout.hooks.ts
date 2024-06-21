import { useEffect } from 'react';

import { Menu } from '@ncobase/types';

import { useLayoutContext } from './layout.context';

/**
 * set focus mode
 * @param enabled {boolean}
 */
export const useFocusMode = (enabled = true) => {
  const { setIsFocusMode = () => {} } = useLayoutContext();

  useEffect(() => {
    setIsFocusMode(enabled);
    return () => setIsFocusMode(false);
  }, [setIsFocusMode, enabled]);
};

/**
 * set page view mode
 * @param vmode {('default' | 'modal' | 'side' | 'fullscreen')}
 */
export const useVmode = (vmode: 'default' | 'modal' | 'side' | 'fullscreen') => {
  const { setVmode = () => {} } = useLayoutContext();
  useEffect(() => {
    setVmode(vmode);
    return () => setVmode('default');
  }, [setVmode, vmode]);
};

/**
 * set page header menus
 * @param menus {Menu[]}
 */
export const useMenus = (): [Menu[], (menus: Menu[]) => void] => {
  const { menus, setMenus } = useLayoutContext();
  if (!setMenus) {
    throw new Error('setMenus function is not provided');
  }
  return [menus, setMenus];
};
