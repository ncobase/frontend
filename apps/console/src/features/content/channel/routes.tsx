import { lazyNamed, renderRoutes } from '@/router';

const ChannelCreatePage = lazyNamed(() => import('./pages/create'), 'ChannelCreatePage');
const ChannelEditPage = lazyNamed(() => import('./pages/edit'), 'ChannelEditPage');
const ChannelListPage = lazyNamed(() => import('./pages/list'), 'ChannelListPage');
const ChannelViewPage = lazyNamed(() => import('./pages/view'), 'ChannelViewPage');

export const ChannelRoutes = () => {
  const routes = [
    { path: '/', element: <ChannelListPage /> },
    { path: '/create', element: <ChannelCreatePage /> },
    { path: '/:id', element: <ChannelViewPage /> },
    { path: '/:id/edit', element: <ChannelEditPage /> }
  ];
  return renderRoutes(routes);
};

export default ChannelRoutes;
