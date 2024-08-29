import React from 'react';

import { MenuListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const MenuRoutes = () => {
  const routes = [
    { path: '/', element: <MenuListPage /> },
    { path: '/:mode', element: <MenuListPage /> },
    { path: '/:mode/:slug', element: <MenuListPage /> }
  ];
  return renderRoutes(routes);
};

export default MenuRoutes;
