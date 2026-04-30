import { lazyNamed, renderRoutes } from '@/router';

const DictionaryListPage = lazyNamed(() => import('./pages/list'), 'DictionaryListPage');

export const DictionaryRoutes = () => {
  const routes = [
    { path: '/', element: <DictionaryListPage /> },
    { path: '/:mode', element: <DictionaryListPage /> },
    { path: '/:mode/:slug', element: <DictionaryListPage /> }
  ];
  return renderRoutes(routes);
};

export default DictionaryRoutes;
