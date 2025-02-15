import { UserListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const UserRoutes = () => {
  const routes = [
    { path: '/', element: <UserListPage /> },
    { path: '/:mode', element: <UserListPage /> },
    { path: '/:mode/:slug', element: <UserListPage /> }
  ];
  return renderRoutes(routes);
};

export default UserRoutes;
