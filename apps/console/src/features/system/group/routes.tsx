import React from 'react';

import { GroupListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const GroupRoutes = () => {
  const routes = [{ path: '/', element: <GroupListPage /> }];
  return renderRoutes(routes);
};

export default GroupRoutes;
