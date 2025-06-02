import { OptionListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const OptionRoutes = () => {
  const routes = [
    { path: '/', element: <OptionListPage /> },
    { path: '/:mode', element: <OptionListPage /> },
    { path: '/:mode/:id', element: <OptionListPage /> }
  ];
  return renderRoutes(routes);
};

export default OptionRoutes;
