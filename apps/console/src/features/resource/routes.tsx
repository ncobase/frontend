import { ResourceAdminPage } from './pages/admin';
import { ResourceListPage } from './pages/list';
import { ResourceViewPage } from './pages/view';

import { renderRoutes } from '@/router';

export const ResourceRoutes = () => {
  const routes = [
    { path: '/', element: <ResourceListPage /> },
    { path: '/admin', element: <ResourceAdminPage /> },
    { path: '/view/:slug', element: <ResourceViewPage /> },
    { path: '/:mode', element: <ResourceListPage /> },
    { path: '/:mode/:slug', element: <ResourceListPage /> }
  ];
  return renderRoutes(routes);
};

export default ResourceRoutes;
