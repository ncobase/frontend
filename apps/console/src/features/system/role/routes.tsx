import React from 'react';

import { RoleListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const RoleRoutes = () => {
  const routes = [{ path: '/', element: <RoleListPage /> }];
  return renderRoutes(routes);
};

export default RoleRoutes;
