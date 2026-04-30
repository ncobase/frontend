import { lazyNamed, renderRoutes } from '@/router';

const WorkflowCreatePage = lazyNamed(() => import('./pages/create'), 'WorkflowCreatePage');
const WorkflowEditPage = lazyNamed(() => import('./pages/edit'), 'WorkflowEditPage');
const WorkflowListPage = lazyNamed(() => import('./pages/list'), 'WorkflowListPage');
const WorkflowViewPage = lazyNamed(() => import('./pages/view'), 'WorkflowViewPage');

export const WorkflowRoutes = () => {
  const routes = [
    { path: '/', element: <WorkflowListPage /> },
    { path: '/create', element: <WorkflowCreatePage /> },
    { path: '/:id', element: <WorkflowViewPage /> },
    { path: '/:id/edit', element: <WorkflowEditPage /> }
  ];
  return renderRoutes(routes);
};

export default WorkflowRoutes;
