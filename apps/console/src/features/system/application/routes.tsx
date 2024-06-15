import React from 'react';

import { ApplicationListPage } from './pages/application.list';

import { renderRoutes } from '@/router';

export const ApplicationRoutes = () => {
  const routes = [{ path: '/', element: <ApplicationListPage /> }];
  return renderRoutes(routes);
};
