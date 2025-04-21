import { useEffect } from 'react';

import { useLayoutContext } from './layout.context';

import { PREFERENCES_VIEW_MODE_KEY } from '@/components/preferences';
import { Menu } from '@/features/system/menu/menu';
import { useLocalStorage } from '@/hooks/use_local_storage';

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
  const { setValue: setPreferredViewMode } = useLocalStorage(PREFERENCES_VIEW_MODE_KEY, null);

  useEffect(() => {
    // Update both context and stored preference
    setVmode(vmode);
    setPreferredViewMode(vmode);

    return () => {
      // Reset to flatten on unmount
      setVmode('flatten');
      setPreferredViewMode('flatten');
    };
  }, [setVmode, setPreferredViewMode, vmode]);
};

/**
 * set page header menus
 * @param menus {Menu[]}
 */
export const useMenus = (): [Menu[], (_menus: Menu[]) => void] => {
  const { menus, setMenus } = useLayoutContext();
  if (!setMenus) {
    throw new Error('setMenus function is not provided');
  }
  return [menus || [], setMenus];
};
