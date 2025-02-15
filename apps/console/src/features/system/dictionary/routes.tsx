import { DictionaryListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const DictionaryRoutes = () => {
  const routes = [
    { path: '/', element: <DictionaryListPage /> },
    { path: '/:mode', element: <DictionaryListPage /> },
    { path: '/:mode/:slug', element: <DictionaryListPage /> }
  ];
  return renderRoutes(routes);
};

export default DictionaryRoutes;
