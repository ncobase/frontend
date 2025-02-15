import { CommentRoutes } from './comment/routes';
import { TaxonomyRoutes } from './taxonomy/routes';
import { TopicRoutes } from './topic/routes';

import { renderRoutes } from '@/router';

export const ContentRoutes = () => {
  const routes = [
    { path: '/topic/*', element: <TopicRoutes /> },
    { path: '/taxonomy/*', element: <TaxonomyRoutes /> },
    { path: '/comment/*', element: <CommentRoutes /> },
    { path: '/trash/*', element: <TopicRoutes /> },
    { path: '/approval/*', element: <TopicRoutes /> },
    { path: '/component/*', element: <TopicRoutes /> }
  ];
  return renderRoutes(routes);
};

export default ContentRoutes;
