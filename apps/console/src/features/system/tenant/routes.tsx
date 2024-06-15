import React from 'react';

import { TenantListPage } from './pages/tenant.list';

import { renderRoutes } from '@/router';

export const TenantRoutes = () => {
  const routes = [{ path: '/', element: <TenantListPage /> }];
  return renderRoutes(routes);
};
