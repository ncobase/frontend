import { OptionsListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const OptionsRoutes = () => {
  const routes = [
    { path: '/', element: <OptionsListPage /> },
    { path: '/:mode', element: <OptionsListPage /> },
    { path: '/:mode/:id', element: <OptionsListPage /> }
  ];
  return renderRoutes(routes);
};

export default OptionsRoutes;
