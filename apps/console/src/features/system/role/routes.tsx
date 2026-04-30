import { lazyNamed, renderRoutes } from '@/router';

const RoleListPage = lazyNamed(() => import('./pages/list'), 'RoleListPage');

export const RoleRoutes = () => {
  const routes = [
    { path: '/', element: <RoleListPage /> },
    { path: '/:mode', element: <RoleListPage /> },
    { path: '/:mode/:slug', element: <RoleListPage /> }
  ];
  return renderRoutes(routes);
};

export default RoleRoutes;
