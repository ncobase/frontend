import React from 'react';

import { TenantListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const TenantRoutes = () => {
  const routes = [{ path: '/', element: <TenantListPage /> }];
  return renderRoutes(routes);
};

export default TenantRoutes;
