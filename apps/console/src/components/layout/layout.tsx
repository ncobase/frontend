import React, { useState, useEffect } from 'react';

import { LayoutContext, LayoutContextValue, NavigationMenus } from './layout.context';

import { PREFERENCES_VIEW_MODE_KEY } from '@/components/preferences';
import { Viewport } from '@/components/viewport';
import { LoginInterceptorProvider } from '@/features/account/pages/auth/login_interceptor';
import { MenuTree } from '@/features/system/menu/menu';
import { useLocalStorage } from '@/hooks/use_local_storage';

interface LayoutProps {
  children: React.ReactNode;
}

// Flatten menu groups
const flattenNavigationMenus = (groups: NavigationMenus): MenuTree[] => {
  const flattened: MenuTree[] = [];

  try {
    if (groups.headers && Array.isArray(groups.headers)) flattened.push(...groups.headers);
    if (groups.sidebars && Array.isArray(groups.sidebars)) flattened.push(...groups.sidebars);
    if (groups.accounts && Array.isArray(groups.accounts)) flattened.push(...groups.accounts);
    if (groups.tenants && Array.isArray(groups.tenants)) flattened.push(...groups.tenants);
  } catch (error) {
    console.error('Error flattening menu groups:', error);
  }

  return flattened;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { storedValue: preferredViewMode, setValue: setPreferredViewMode } = useLocalStorage<
    LayoutContextValue['vmode']
  >(PREFERENCES_VIEW_MODE_KEY, 'flatten');

  const [isFocusMode, setIsFocusMode] = React.useState<LayoutContextValue['isFocusMode']>(false);
  const [vmode, setVmodeInternal] = React.useState<LayoutContextValue['vmode']>(preferredViewMode);
  const [navigationMenus, setNavigationMenus] = useState<NavigationMenus>({
    headers: [],
    sidebars: [],
    accounts: [],
    tenants: []
  });
  const [menus, setMenus] = useState<MenuTree[]>([]);

  const setVmode = React.useCallback(
    (newMode: 'modal' | 'flatten') => {
      setVmodeInternal(newMode);
      setPreferredViewMode(newMode);
    },
    [setPreferredViewMode]
  );

  useEffect(() => {
    if (preferredViewMode && preferredViewMode !== vmode) {
      setVmodeInternal(preferredViewMode);
    }
  }, [preferredViewMode, vmode]);

  // Flatten menu groups to single array for backward compatibility
  useEffect(() => {
    try {
      const allMenus = flattenNavigationMenus(navigationMenus);
      setMenus(allMenus);
    } catch (error) {
      console.error('Error setting flattened menus:', error);
      setMenus([]);
    }
  }, [navigationMenus]);

  const layoutContextValue = React.useMemo(
    () => ({
      vmode,
      setVmode,
      navigationMenus,
      setNavigationMenus,
      menus,
      setMenus,
      isFocusMode,
      setIsFocusMode
    }),
    [vmode, setVmode, navigationMenus, menus, isFocusMode, setIsFocusMode]
  );

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      <Viewport>{children}</Viewport>
      <LoginInterceptorProvider />
    </LayoutContext.Provider>
  );
};
