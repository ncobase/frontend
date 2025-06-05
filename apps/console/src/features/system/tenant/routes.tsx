import { TenantListPage } from './pages/list';
import { TenantUserListPage } from './pages/user/list';

import { renderRoutes } from '@/router';

export const TenantRoutes = () => {
  const routes = [
    { path: '/', element: <TenantListPage /> },
    { path: '/:mode', element: <TenantListPage /> },
    { path: '/:mode/:slug', element: <TenantListPage /> },
    { path: '/:tenantId/users', element: <TenantUserListPage /> },
    { path: '/:tenantId/users/:mode', element: <TenantUserListPage /> },
    { path: '/:tenantId/users/:mode/:userId', element: <TenantUserListPage /> }
  ];
  return renderRoutes(routes);
};

export default TenantRoutes;
