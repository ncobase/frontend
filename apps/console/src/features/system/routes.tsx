import AccessRoutes from './access/routes';
import { BasicRoutes } from './basic/routes';
import { DictionaryRoutes } from './dictionary/routes';
import { MenuRoutes } from './menu/routes';
import { OptionRoutes } from './option/routes';
import { OrgRoutes } from './organization/routes';
import { PermissionRoutes } from './permission/routes';
import { RoleRoutes } from './role/routes';
import { UserRoutes } from './user/routes';

import { Guard, renderRoutes } from '@/router';

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
