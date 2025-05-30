import { BasicRoutes } from './basic/routes';
import { DictionaryRoutes } from './dictionary/routes';
import { GroupRoutes } from './group/routes';
import { MenuRoutes } from './menu/routes';
import OptionsRoutes from './options/routes';
import { PermissionRoutes } from './permission/routes';
import { RoleRoutes } from './role/routes';
import { TenantRoutes } from './tenant/routes';
import { UserRoutes } from './user/routes';

import { Guard, renderRoutes } from '@/router';

export const SystemRoutes = () => {
  const routes = [
    { path: 'dictionary/*', element: <DictionaryRoutes /> },
    { path: 'group/*', element: <GroupRoutes /> },
    { path: 'user/*', element: <UserRoutes /> },
    { path: 'permission/*', element: <PermissionRoutes /> },
    { path: 'menu/*', element: <MenuRoutes /> },
    { path: 'role/*', element: <RoleRoutes /> },
    { path: 'tenant/*', element: <TenantRoutes /> },
    { path: 'basic/*', element: <Guard super children={<BasicRoutes />} /> },
    { path: 'options/*', element: <OptionsRoutes /> }
  ];
  return renderRoutes(routes);
};

export default SystemRoutes;
