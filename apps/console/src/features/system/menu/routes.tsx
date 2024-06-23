import React from 'react';

import { MenuPage } from './menu';

import { renderRoutes } from '@/router';

export const MenuRoutes = () => {
  const routes = [
    { path: '/', element: <MenuPage /> },
    { path: '/:mode', element: <MenuPage /> },
    { path: '/:mode/:slug', element: <MenuPage /> },
    { path: '/:mode/:slug', element: <MenuPage /> }
  ];
  return renderRoutes(routes);
};

export default MenuRoutes;
