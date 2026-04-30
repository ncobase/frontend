import { DistributionCreatePage } from './pages/create';
import { DistributionEditPage } from './pages/edit';
import { DistributionListPage } from './pages/list';
import { DistributionViewPage } from './pages/view';

import { renderRoutes } from '@/router';

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
