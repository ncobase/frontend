import { MediaEditPage } from './pages/edit';
import { MediaListPage } from './pages/list';
import { MediaViewPage } from './pages/view';

import { ErrorPage } from '@/components/errors';
import { renderRoutes } from '@/router';

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
