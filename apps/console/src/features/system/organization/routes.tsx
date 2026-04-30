import { lazyNamed, renderRoutes } from '@/router';

const OrgListPage = lazyNamed(() => import('./pages/list'), 'OrgListPage');

export const OrgRoutes = () => {
  const routes = [
    { path: '/', element: <OrgListPage /> },
    { path: '/:mode', element: <OrgListPage /> },
    { path: '/:mode/:slug', element: <OrgListPage /> }
  ];
  return renderRoutes(routes);
};

export default OrgRoutes;
