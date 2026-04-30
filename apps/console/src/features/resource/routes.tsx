import { lazyNamed } from '@/router';
import { Guard, renderRoutes } from '@/router/helpers';

const ResourceAdminPage = lazyNamed(() => import('./pages/admin'), 'ResourceAdminPage');
const ResourceListPage = lazyNamed(() => import('./pages/list'), 'ResourceListPage');
const ResourceViewPage = lazyNamed(() => import('./pages/view'), 'ResourceViewPage');

export const ResourceRoutes = () => {
  const routes = [
    { path: '/', element: <ResourceListPage /> },
    {
      path: '/admin',
      element: (
        <Guard admin>
          <ResourceAdminPage />
        </Guard>
      )
    },
    { path: '/view/:slug', element: <ResourceViewPage /> },
    { path: '/:mode', element: <ResourceListPage /> },
    { path: '/:mode/:slug', element: <ResourceListPage /> }
  ];
  return renderRoutes(routes);
};

export default ResourceRoutes;
