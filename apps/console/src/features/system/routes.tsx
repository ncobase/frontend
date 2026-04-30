import { lazy } from 'react';

import { Guard, lazyNamed, renderRoutes } from '@/router';

const AccessRoutes = lazy(() => import('./access/routes'));
const BasicRoutes = lazy(() => import('./basic/routes'));
const DictionaryRoutes = lazy(() => import('./dictionary/routes'));
const MenuRoutes = lazy(() => import('./menu/routes'));
const OptionRoutes = lazyNamed(() => import('./option/routes'), 'OptionRoutes');
const OrgRoutes = lazy(() => import('./organization/routes'));
const PermissionRoutes = lazy(() => import('./permission/routes'));
const RoleRoutes = lazy(() => import('./role/routes'));
const UserRoutes = lazy(() => import('./user/routes'));

export const SystemRoutes = () => {
  const routes = [
    { path: 'access/*', element: <AccessRoutes /> },
    { path: 'dictionaries/*', element: <DictionaryRoutes /> },
    { path: 'orgs/*', element: <OrgRoutes /> },
    { path: 'users/*', element: <UserRoutes /> },
    { path: 'permissions/*', element: <PermissionRoutes /> },
    { path: 'menus/*', element: <MenuRoutes /> },
    { path: 'roles/*', element: <RoleRoutes /> },
    { path: 'basics/*', element: <Guard super children={<BasicRoutes />} /> },
    { path: 'options/*', element: <OptionRoutes /> }
  ];
  return renderRoutes(routes);
};

export default SystemRoutes;
