import { Guard, lazyNamed, renderRoutes } from '@/router';

const CreateTaxonomyPage = lazyNamed(() => import('./pages/create'), 'CreateTaxonomyPage');
const TaxonomyEditPage = lazyNamed(() => import('./pages/edit'), 'TaxonomyEditPage');
const TaxonomyListPage = lazyNamed(() => import('./pages/list'), 'TaxonomyListPage');
const TaxonomyViewPage = lazyNamed(() => import('./pages/view'), 'TaxonomyViewPage');

export const TaxonomyRoutes = () => {
  const readPermissions = ['read:content', 'manage:content', 'read:cms', 'manage:cms'];
  const managePermissions = ['manage:content', 'manage:cms', 'manage:taxonomies'];
  const routes = [
    {
      path: '/',
      element: <Guard permissions={readPermissions} any children={<TaxonomyListPage />} />
    },
    {
      path: '/create',
      element: <Guard permissions={managePermissions} any children={<CreateTaxonomyPage />} />
    },
    {
      path: '/:id',
      element: <Guard permissions={readPermissions} any children={<TaxonomyViewPage />} />
    },
    {
      path: '/:id/edit',
      element: <Guard permissions={managePermissions} any children={<TaxonomyEditPage />} />
    }
  ];
  return renderRoutes(routes);
};

export default TaxonomyRoutes;
