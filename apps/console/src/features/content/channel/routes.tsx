import { ChannelCreatePage } from './pages/create';
import { ChannelEditPage } from './pages/edit';
import { ChannelListPage } from './pages/list';
import { ChannelViewPage } from './pages/view';

import { renderRoutes } from '@/router';

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
