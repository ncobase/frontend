import { OrgListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const GroupRoutes = () => {
  const routes = [
    { path: '/', element: <OrgListPage /> },
    { path: '/:mode', element: <OrgListPage /> },
    { path: '/:mode/:slug', element: <OrgListPage /> }
  ];
  return renderRoutes(routes);
};

export default GroupRoutes;
