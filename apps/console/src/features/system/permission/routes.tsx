import { PermissionListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const PermissionRoutes = () => {
  const routes = [
    { path: '/', element: <PermissionListPage /> },
    { path: '/:mode', element: <PermissionListPage /> },
    { path: '/:mode/:slug', element: <PermissionListPage /> }
  ];
  return renderRoutes(routes);
};

export default PermissionRoutes;
