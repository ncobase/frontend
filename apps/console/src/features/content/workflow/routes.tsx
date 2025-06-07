import { WorkflowCreatePage } from './pages/create';
import { WorkflowEditPage } from './pages/edit';
import { WorkflowListPage } from './pages/list';
import { WorkflowViewPage } from './pages/view';

import { renderRoutes } from '@/router';

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
