import React from 'react';

import { GroupListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const GroupRoutes = () => {
  const routes = [
    { path: '/', element: <GroupListPage /> },
    { path: '/:mode', element: <GroupListPage /> },
    { path: '/:mode/:slug', element: <GroupListPage /> },
    { path: '/:mode/:slug', element: <GroupListPage /> }
  ];
  return renderRoutes(routes);
};

export default GroupRoutes;
