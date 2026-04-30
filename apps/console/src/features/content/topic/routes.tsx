import { lazyNamed, renderRoutes } from '@/router';

const CreateTopicPage = lazyNamed(() => import('./pages/create'), 'CreateTopicPage');
const TopicEditPage = lazyNamed(() => import('./pages/edit'), 'TopicEditPage');
const TopicListPage = lazyNamed(() => import('./pages/list'), 'TopicListPage');
const TopicViewPage = lazyNamed(() => import('./pages/view'), 'TopicViewPage');

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
