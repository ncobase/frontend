import { lazyNamed, renderRoutes } from '@/router';

const UserListPage = lazyNamed(() => import('./pages/list'), 'UserListPage');

export const UserRoutes = () => {
  const routes = [
    { path: '/', element: <UserListPage /> },
    { path: '/:mode', element: <UserListPage /> },
    { path: '/:mode/:slug', element: <UserListPage /> }
  ];
  return renderRoutes(routes);
};

export default UserRoutes;
