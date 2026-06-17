import { Guard, lazyNamed, renderRoutes } from '@/router';

const CreateTopicPage = lazyNamed(() => import('./pages/create'), 'CreateTopicPage');
const TopicEditPage = lazyNamed(() => import('./pages/edit'), 'TopicEditPage');
const TopicListPage = lazyNamed(() => import('./pages/list'), 'TopicListPage');
const TopicViewPage = lazyNamed(() => import('./pages/view'), 'TopicViewPage');

export const TopicRoutes = () => {
  const readPermissions = ['read:content', 'manage:content', 'read:cms', 'manage:cms'];
  const managePermissions = ['manage:content', 'manage:cms'];
  const routes = [
    {
      path: '/',
      element: <Guard permissions={readPermissions} any children={<TopicListPage />} />
    },
    {
      path: '/create',
      element: <Guard permissions={managePermissions} any children={<CreateTopicPage />} />
    },
    {
      path: '/:id',
      element: <Guard permissions={readPermissions} any children={<TopicViewPage />} />
    },
    {
      path: '/:id/edit',
      element: <Guard permissions={managePermissions} any children={<TopicEditPage />} />
    }
  ];
  return renderRoutes(routes);
};

export default TopicRoutes;
