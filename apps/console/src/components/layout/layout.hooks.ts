import { useEffect, useCallback } from 'react';

import { useLayoutContext, NavigationMenus } from './layout.context';

import { PREFERENCES_VIEW_MODE_KEY } from '@/components/preferences';
import { MenuTree } from '@/features/system/menu/menu';
import { useLocalStorage } from '@/hooks/use_local_storage';

/**
 * set focus mode
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
 */
export const useVmode = (vmode: 'modal' | 'flatten') => {
  const { setVmode = () => {} } = useLayoutContext();
  const { setValue: setPreferredViewMode } = useLocalStorage(PREFERENCES_VIEW_MODE_KEY, null);

  useEffect(() => {
    setVmode(vmode);
    setPreferredViewMode(vmode);

    return () => {
      setVmode('flatten');
      setPreferredViewMode('flatten');
    };
  }, [setVmode, setPreferredViewMode, vmode]);
};

/**
 * Get menu groups by type
 */
export const useNavigationMenus = (): [NavigationMenus, (_groups: NavigationMenus) => void] => {
  const { navigationMenus, setNavigationMenus } = useLayoutContext();

  if (!setNavigationMenus) {
    throw new Error('setNavigationMenus function is not provided');
  }

  // Create a stable callback that doesn't change on every render
  const stableSetNavigationMenus = useCallback(
    (groups: NavigationMenus) => {
      setNavigationMenus(groups);
    },
    [setNavigationMenus]
  );

  return [navigationMenus || ({} as NavigationMenus), stableSetNavigationMenus];
};

/**
 * Get specific menu type
 */
export const useMenusByType = (type: keyof NavigationMenus): MenuTree[] => {
  const [navigationMenus] = useNavigationMenus();

  // Use callback to ensure stable reference and prevent unnecessary re-renders
  return useCallback(() => {
    return navigationMenus[type] || [];
  }, [navigationMenus, type])();
};

/**
 * Get all menus flattened (for backward compatibility)
 */
export const useMenus = (): [MenuTree[], (_menus: MenuTree[]) => void] => {
  const { menus, setMenus } = useLayoutContext();

  if (!setMenus) {
    throw new Error('setMenus function is not provided');
  }

  // Create stable callback
  const stableSetMenus = useCallback(
    (newMenus: MenuTree[]) => {
      setMenus(newMenus);
    },
    [setMenus]
  );

  return [menus || [], stableSetMenus];
};
