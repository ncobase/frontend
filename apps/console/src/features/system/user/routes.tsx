import React from 'react';

import { UserListPage } from './pages/user.list';

import { renderRoutes } from '@/router';

export const UserRoutes = () => {
  const routes = [{ path: '/', element: <UserListPage /> }];
  return renderRoutes(routes);
};

export default UserRoutes;
