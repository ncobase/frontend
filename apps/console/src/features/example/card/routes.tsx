import { lazyNamed, renderRoutes } from '@/router';

const CardList = lazyNamed(() => import('./card'), 'CardList');
const EditorPage = lazyNamed(() => import('./component/editor'), 'EditorPage');
const ElementPage = lazyNamed(() => import('./component/element'), 'ElementPage');
const LayoutPage = lazyNamed(() => import('./component/layout'), 'LayoutPage');
const TemplatePage = lazyNamed(() => import('./component/template'), 'TemplatePage');
const LogPage = lazyNamed(() => import('./efficiency/log'), 'LogPage');
const ReportPage = lazyNamed(() => import('./efficiency/report'), 'ReportPage');
const TaskPage = lazyNamed(() => import('./efficiency/task'), 'TaskPage');
const WorkflowPage = lazyNamed(() => import('./efficiency/workflow'), 'WorkflowPage');
const PermissionPage = lazyNamed(() => import('./model/permission'), 'PermissionPage');
const RolePage = lazyNamed(() => import('./model/role'), 'RolePage');
const UserPage = lazyNamed(() => import('./model/user'), 'UserPage');

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
