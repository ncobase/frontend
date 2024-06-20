import React from 'react';

import { MenuListPage } from './pages/menu.list';

import { renderRoutes } from '@/router';

export const MenuRoutes = () => {
  const routes = [{ path: '/', element: <MenuListPage /> }];
  return renderRoutes(routes);
};

export default MenuRoutes;
