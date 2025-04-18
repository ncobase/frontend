import { useEffect } from 'react';

import { useLayoutContext } from './layout.context';

import { Menu } from '@/features/system/menu/menu';

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
 * @param vmode {('modal' | 'flatten')}
 */
export const useVmode = (vmode: 'modal' | 'flatten') => {
  const { setVmode = () => {} } = useLayoutContext();
  useEffect(() => {
    setVmode(vmode);
    return () => setVmode('flatten');
  }, [setVmode, vmode]);
};

/**
 * set page header menus
 * @param menus {Menu[]}
 */
// eslint-disable-next-line no-unused-vars
export const useMenus = (): [Menu[], (menus: Menu[]) => void] => {
  const { menus, setMenus } = useLayoutContext();
  if (!setMenus) {
    throw new Error('setMenus function is not provided');
  }
  return [menus, setMenus];
};
