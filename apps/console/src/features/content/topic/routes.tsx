import { TopicListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const TopicRoutes = () => {
  const routes = [
    { path: '/', element: <TopicListPage /> },
    { path: '/:mode', element: <TopicListPage /> },
    { path: '/:mode/:slug', element: <TopicListPage /> }
  ];
  return renderRoutes(routes);
};

export default TopicRoutes;
