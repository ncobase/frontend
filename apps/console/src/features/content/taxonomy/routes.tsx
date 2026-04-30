import { lazyNamed, renderRoutes } from '@/router';

const CreateTaxonomyPage = lazyNamed(() => import('./pages/create'), 'CreateTaxonomyPage');
const TaxonomyEditPage = lazyNamed(() => import('./pages/edit'), 'TaxonomyEditPage');
const TaxonomyListPage = lazyNamed(() => import('./pages/list'), 'TaxonomyListPage');
const TaxonomyViewPage = lazyNamed(() => import('./pages/view'), 'TaxonomyViewPage');

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
