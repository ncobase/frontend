import React, { useState, useEffect } from 'react';

import { LayoutContext, LayoutContextValue } from './layout.context';

import { PREFERENCES_VIEW_MODE_KEY } from '@/components/preferences';
import { Viewport } from '@/components/viewport';
import { LoginInterceptorProvider } from '@/features/account/pages/auth/login_interceptor';
import { Menu } from '@/features/system/menu/menu';
import { useLocalStorage } from '@/hooks/use_local_storage';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Get preference from local storage with fallback to default
  const { storedValue: preferredViewMode, setValue: setPreferredViewMode } = useLocalStorage<
    LayoutContextValue['vmode']
  >(PREFERENCES_VIEW_MODE_KEY, 'flatten');

  const [isFocusMode, setIsFocusMode] = React.useState<LayoutContextValue['isFocusMode']>(false);
  const [vmode, setVmodeInternal] = React.useState<LayoutContextValue['vmode']>(preferredViewMode);
  const [menus, setMenus] = useState<Menu[]>([]);

  // Sync vmode changes with preferences
  const setVmode = (newMode: 'modal' | 'flatten') => {
    setVmodeInternal(newMode);
    setPreferredViewMode(newMode);
  };

  // Keep internal state in sync with preferences
  useEffect(() => {
    if (preferredViewMode && preferredViewMode !== vmode) {
      setVmodeInternal(preferredViewMode);
    }
  }, [preferredViewMode, vmode]);

  const layoutContextValue = {
    vmode,
    setVmode,
    menus,
    setMenus,
    isFocusMode,
    setIsFocusMode
  };

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      <Viewport>{children}</Viewport>
      <LoginInterceptorProvider />
    </LayoutContext.Provider>
  );
};
