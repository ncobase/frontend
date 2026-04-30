import { lazyNamed, renderRoutes } from '@/router';

const PermissionListPage = lazyNamed(() => import('./pages/list'), 'PermissionListPage');

export const PermissionRoutes = () => {
  const routes = [
    { path: '/', element: <PermissionListPage /> },
    { path: '/:mode', element: <PermissionListPage /> },
    { path: '/:mode/:slug', element: <PermissionListPage /> }
  ];
  return renderRoutes(routes);
};

export default PermissionRoutes;
