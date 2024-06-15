import React from 'react';

import { SystemSettingsPage } from './system';

import { renderRoutes } from '@/router';

export const BasicRoutes = () => {
  const routes = [{ path: '/', element: <SystemSettingsPage /> }];
  return renderRoutes(routes);
};
