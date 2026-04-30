import { lazyNamed, renderRoutes } from '@/router';

const Elements = lazyNamed(() => import('./elements'), 'Elements');
const CreatePage = lazyNamed(() => import('./forms/create'), 'CreatePage');
const EditorPage = lazyNamed(() => import('./forms/editor'), 'EditorPage');
const ViewerPage = lazyNamed(() => import('./forms/viewer'), 'ViewerPage');

export const ExampleUIRoutes = () => {
  const routes = [
    { path: 'elements', element: <Elements /> },
    { path: 'form/create', element: <CreatePage /> },
    { path: 'form/editor', element: <EditorPage /> },
    { path: 'form/viewer', element: <ViewerPage /> }
  ];
  return renderRoutes(routes);
};
