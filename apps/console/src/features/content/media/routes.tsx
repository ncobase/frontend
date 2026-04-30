import { ErrorPage } from '@/components/errors';
import { lazyNamed, renderRoutes } from '@/router';

const MediaEditPage = lazyNamed(() => import('./pages/edit'), 'MediaEditPage');
const MediaListPage = lazyNamed(() => import('./pages/list'), 'MediaListPage');
const MediaViewPage = lazyNamed(() => import('./pages/view'), 'MediaViewPage');

export const MediaRoutes = () => {
  const routes = [
    { path: '/', element: <MediaListPage /> },
    { path: '/:id', element: <MediaViewPage /> },
    { path: '/:id/edit', element: <MediaEditPage /> },
    { path: '*', element: <ErrorPage code={404} /> }
  ];
  return renderRoutes(routes);
};

export default MediaRoutes;
