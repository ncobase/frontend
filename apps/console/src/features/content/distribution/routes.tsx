import { Guard, lazyNamed, renderRoutes } from '@/router';

const DistributionCreatePage = lazyNamed(() => import('./pages/create'), 'DistributionCreatePage');
const DistributionEditPage = lazyNamed(() => import('./pages/edit'), 'DistributionEditPage');
const DistributionListPage = lazyNamed(() => import('./pages/list'), 'DistributionListPage');
const DistributionViewPage = lazyNamed(() => import('./pages/view'), 'DistributionViewPage');

export const DistributionRoutes = () => {
  const readPermissions = ['read:content', 'manage:content', 'read:cms', 'manage:cms'];
  const managePermissions = ['manage:content', 'manage:cms'];
  const routes = [
    {
      path: '/',
      element: <Guard permissions={readPermissions} any children={<DistributionListPage />} />
    },
    {
      path: '/create',
      element: <Guard permissions={managePermissions} any children={<DistributionCreatePage />} />
    },
    {
      path: '/:id',
      element: <Guard permissions={readPermissions} any children={<DistributionViewPage />} />
    },
    {
      path: '/:id/edit',
      element: <Guard permissions={managePermissions} any children={<DistributionEditPage />} />
    }
  ];
  return renderRoutes(routes);
};

export default DistributionRoutes;
