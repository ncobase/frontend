import { MediaCreatePage } from './pages/create';
import { MediaEditPage } from './pages/edit';
import { MediaListPage } from './pages/list';
import { MediaViewPage } from './pages/view';

import { renderRoutes } from '@/router';

export const MediaRoutes = () => {
  const routes = [
    { path: '/', element: <MediaListPage /> },
    { path: '/create', element: <MediaCreatePage /> },
    { path: '/:id', element: <MediaViewPage /> },
    { path: '/:id/edit', element: <MediaEditPage /> }
  ];
  return renderRoutes(routes);
};

export default MediaRoutes;
