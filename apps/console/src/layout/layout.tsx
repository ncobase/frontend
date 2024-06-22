import React, { useState } from 'react';

import { LayoutContext, LayoutContextValue } from './layout.context';

import { Viewport } from '@/components/viewport';
import { LoginInterceptorProvider } from '@/features/account/pages/auth/login_interceptor';
import { Menu } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isFocusMode, setIsFocusMode] = React.useState<LayoutContextValue['isFocusMode']>(false);
  const [vmode, setVmode] = React.useState<LayoutContextValue['vmode']>('default');
  const [menus, setMenus] = useState<Menu[]>([]);

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
