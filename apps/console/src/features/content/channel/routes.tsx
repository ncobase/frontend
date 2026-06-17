import { Guard, lazyNamed, renderRoutes } from '@/router';

const ChannelCreatePage = lazyNamed(() => import('./pages/create'), 'ChannelCreatePage');
const ChannelEditPage = lazyNamed(() => import('./pages/edit'), 'ChannelEditPage');
const ChannelListPage = lazyNamed(() => import('./pages/list'), 'ChannelListPage');
const ChannelViewPage = lazyNamed(() => import('./pages/view'), 'ChannelViewPage');

export const ChannelRoutes = () => {
  const readPermissions = ['read:content', 'manage:content', 'read:cms', 'manage:cms'];
  const managePermissions = ['manage:content', 'manage:cms'];
  const routes = [
    {
      path: '/',
      element: <Guard permissions={readPermissions} any children={<ChannelListPage />} />
    },
    {
      path: '/create',
      element: <Guard permissions={managePermissions} any children={<ChannelCreatePage />} />
    },
    {
      path: '/:id',
      element: <Guard permissions={readPermissions} any children={<ChannelViewPage />} />
    },
    {
      path: '/:id/edit',
      element: <Guard permissions={managePermissions} any children={<ChannelEditPage />} />
    }
  ];
  return renderRoutes(routes);
};

export default ChannelRoutes;
