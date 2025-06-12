import { CreateSpacePage } from './pages/create';
import { SpaceEditPage } from './pages/edit';
import { SpaceListPage } from './pages/list';
import { CreateSpaceUserPage } from './pages/user/create';
import { SpaceUserEditPage } from './pages/user/edit';
import { SpaceUserListPage } from './pages/user/list';
import { SpaceUserViewPage } from './pages/user/view';
import { SpaceViewPage } from './pages/view';

import { renderRoutes } from '@/router';

export const SpaceRoutes = () => {
  const routes = [
    // Main space routes
    { path: '/', element: <SpaceListPage /> },
    { path: '/create', element: <CreateSpacePage /> },
    { path: '/:slug', element: <SpaceViewPage /> },
    { path: '/:slug/edit', element: <SpaceEditPage /> },

    // User management routes
    { path: '/:spaceId/users', element: <SpaceUserListPage /> },
    { path: '/:spaceId/users/create', element: <CreateSpaceUserPage /> },
    { path: '/:spaceId/users/view/:userId', element: <SpaceUserViewPage /> },
    { path: '/:spaceId/users/edit/:userId', element: <SpaceUserEditPage /> }
  ];

  return renderRoutes(routes);
};

export default SpaceRoutes;
