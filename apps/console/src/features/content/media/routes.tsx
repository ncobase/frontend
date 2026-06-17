import { ErrorPage } from '@/components/errors';
import { Guard, lazyNamed, renderRoutes } from '@/router';

const MediaEditPage = lazyNamed(() => import('./pages/edit'), 'MediaEditPage');
const MediaListPage = lazyNamed(() => import('./pages/list'), 'MediaListPage');
const MediaViewPage = lazyNamed(() => import('./pages/view'), 'MediaViewPage');

export const MediaRoutes = () => {
  const readPermissions = ['read:content', 'manage:content', 'read:cms', 'manage:cms'];
  const managePermissions = ['manage:content', 'manage:cms'];
  const routes = [
    {
      path: '/',
      element: <Guard permissions={readPermissions} any children={<MediaListPage />} />
    },
    {
      path: '/:id',
      element: <Guard permissions={readPermissions} any children={<MediaViewPage />} />
    },
    {
      path: '/:id/edit',
      element: <Guard permissions={managePermissions} any children={<MediaEditPage />} />
    },
    { path: '*', element: <ErrorPage code={404} /> }
  ];
  return renderRoutes(routes);
};

export default MediaRoutes;
