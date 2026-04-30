import { lazyNamed, renderRoutes } from '@/router';

const DistributionCreatePage = lazyNamed(() => import('./pages/create'), 'DistributionCreatePage');
const DistributionEditPage = lazyNamed(() => import('./pages/edit'), 'DistributionEditPage');
const DistributionListPage = lazyNamed(() => import('./pages/list'), 'DistributionListPage');
const DistributionViewPage = lazyNamed(() => import('./pages/view'), 'DistributionViewPage');

export const DistributionRoutes = () => {
  const routes = [
    { path: '/', element: <DistributionListPage /> },
    { path: '/create', element: <DistributionCreatePage /> },
    { path: '/:id', element: <DistributionViewPage /> },
    { path: '/:id/edit', element: <DistributionEditPage /> }
  ];
  return renderRoutes(routes);
};

export default DistributionRoutes;
