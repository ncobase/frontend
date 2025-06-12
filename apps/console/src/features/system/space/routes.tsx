import { SpaceListPage } from './pages/list';
import { SpaceUserListPage } from './pages/user/list';

import { renderRoutes } from '@/router';

export const SpaceRoutes = () => {
  const routes = [
    { path: '/', element: <SpaceListPage /> },
    { path: '/:mode', element: <SpaceListPage /> },
    { path: '/:mode/:slug', element: <SpaceListPage /> },
    { path: '/:spaceId/users', element: <SpaceUserListPage /> },
    { path: '/:spaceId/users/:mode', element: <SpaceUserListPage /> },
    { path: '/:spaceId/users/:mode/:userId', element: <SpaceUserListPage /> }
  ];
  return renderRoutes(routes);
};

export default SpaceRoutes;
