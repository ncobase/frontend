import { lazyNamed, renderRoutes } from '@/router';

const CommentListPage = lazyNamed(() => import('./pages/list'), 'CommentListPage');

export const CommentRoutes = () => {
  const routes = [
    { path: '/', element: <CommentListPage /> },
    { path: '/:mode', element: <CommentListPage /> },
    { path: '/:mode/:slug', element: <CommentListPage /> }
  ];
  return renderRoutes(routes);
};

export default CommentRoutes;
