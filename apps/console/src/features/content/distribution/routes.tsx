import { DistributionCreatePage } from './pages/create';
import { DistributionListPage } from './pages/list';
import { DistributionViewPage } from './pages/view';

import { renderRoutes } from '@/router';

export const DistributionRoutes = () => {
  const routes = [
    { path: '/', element: <DistributionListPage /> },
    { path: '/create', element: <DistributionCreatePage /> },
    { path: '/:id', element: <DistributionViewPage /> },
    { path: '/:id/edit', element: <DistributionCreatePage /> }
  ];
  return renderRoutes(routes);
};

export default DistributionRoutes;
