import React from 'react';

import { PermissionListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const PermissionRoutes = () => {
  const routes = [{ path: '/', element: <PermissionListPage /> }];
  return renderRoutes(routes);
};

export default PermissionRoutes;
