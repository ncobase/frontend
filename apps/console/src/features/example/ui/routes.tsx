import { Elements } from './elements';
import { CreatePage, EditorPage, ViewerPage } from './forms';

import { renderRoutes } from '@/router';

export const ExampleUIRoutes = () => {
  const routes = [
    { path: 'elements', element: <Elements /> },
    { path: 'form/create', element: <CreatePage /> },
    { path: 'form/editor', element: <EditorPage /> },
    { path: 'form/viewer', element: <ViewerPage /> }
  ];
  return renderRoutes(routes);
};
