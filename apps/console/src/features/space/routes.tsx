import { lazyNamed, renderRoutes } from '@/router';
import { Guard } from '@/router/helpers/guard';

const CreateSpacePage = lazyNamed(() => import('./pages/create'), 'CreateSpacePage');
const SpaceEditPage = lazyNamed(() => import('./pages/edit'), 'SpaceEditPage');
const SpaceListPage = lazyNamed(() => import('./pages/list'), 'SpaceListPage');
const CreateSpaceUserPage = lazyNamed(() => import('./pages/user/create'), 'CreateSpaceUserPage');
const SpaceUserEditPage = lazyNamed(() => import('./pages/user/edit'), 'SpaceUserEditPage');
const SpaceUserListPage = lazyNamed(() => import('./pages/user/list'), 'SpaceUserListPage');
const SpaceUserViewPage = lazyNamed(() => import('./pages/user/view'), 'SpaceUserViewPage');
const SpaceViewPage = lazyNamed(() => import('./pages/view'), 'SpaceViewPage');

export const SpaceRoutes = () => {
  const routes = [
    // Main space routes
    { path: '/', element: <SpaceListPage /> },
    {
      path: '/create',
      element: <Guard permission='manage:spaces' children={<CreateSpacePage />} />
    },
    { path: '/:slug', element: <SpaceViewPage /> },
    {
      path: '/:slug/edit',
      element: <Guard permission='manage:spaces' children={<SpaceEditPage />} />
    },

    // User management routes
    { path: '/:spaceId/users', element: <SpaceUserListPage /> },
    {
      path: '/:spaceId/users/create',
      element: <Guard permission='manage:spaces' children={<CreateSpaceUserPage />} />
    },
    { path: '/:spaceId/users/view/:userId', element: <SpaceUserViewPage /> },
    {
      path: '/:spaceId/users/edit/:userId',
      element: <Guard permission='manage:spaces' children={<SpaceUserEditPage />} />
    }
  ];

  return renderRoutes(routes);
};

export default SpaceRoutes;
