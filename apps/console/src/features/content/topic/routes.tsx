import { CreateTopicPage } from './pages/create';
import { TopicEditPage } from './pages/edit';
import { TopicListPage } from './pages/list';
import { TopicViewPage } from './pages/view';

import { renderRoutes } from '@/router';

export const TopicRoutes = () => {
  const routes = [
    { path: '/', element: <TopicListPage /> },
    { path: '/create', element: <CreateTopicPage /> },
    { path: '/:id', element: <TopicViewPage /> },
    { path: '/:id/edit', element: <TopicEditPage /> }
  ];
  return renderRoutes(routes);
};

export default TopicRoutes;
