import { CreateTaxonomyPage } from './pages/create';
import { TaxonomyEditPage } from './pages/edit';
import { TaxonomyListPage } from './pages/list';
import { TaxonomyViewPage } from './pages/view';

import { renderRoutes } from '@/router';

export const TaxonomyRoutes = () => {
  const routes = [
    { path: '/', element: <TaxonomyListPage /> },
    { path: '/create', element: <CreateTaxonomyPage /> },
    { path: '/:id', element: <TaxonomyViewPage /> },
    { path: '/:id/edit', element: <TaxonomyEditPage /> }
  ];
  return renderRoutes(routes);
};

export default TaxonomyRoutes;
