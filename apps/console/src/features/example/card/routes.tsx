import { CardList } from './card';
import { EditorPage } from './component/editor';
import { ElementPage } from './component/element';
import { LayoutPage } from './component/layout';
import { TemplatePage } from './component/template';
import { LogPage } from './efficiency/log';
import { ReportPage } from './efficiency/report';
import { TaskPage } from './efficiency/task';
import { WorkflowPage } from './efficiency/workflow';
import { PermissionPage } from './model/permission';
import { RolePage } from './model/role';
import { UserPage } from './model/user';

import { renderRoutes } from '@/router';

export const ExampleCardRoutes = () => {
  const routes = [
    { path: '', element: <CardList /> },

    { path: 'user', element: <UserPage /> },
    { path: 'role', element: <RolePage /> },
    { path: 'permission', element: <PermissionPage /> },
    { path: 'element', element: <ElementPage /> },
    { path: 'editor', element: <EditorPage /> },
    { path: 'layout', element: <LayoutPage /> },
    { path: 'template', element: <TemplatePage /> },
    { path: 'log', element: <LogPage /> },
    { path: 'report', element: <ReportPage /> },
    { path: 'workflow', element: <WorkflowPage /> },
    { path: 'task', element: <TaskPage /> }
  ];
  return renderRoutes(routes);
};
