import React from 'react';

import { BasicRoutes } from './basic/routes';
import { DictionaryRoutes } from './dictionary/routes';
import { GroupRoutes } from './group/routes';
import { MenuRoutes } from './menu/routes';
import { PermissionRoutes } from './permission/routes';
import { RoleRoutes } from './role/routes';
import { TenantRoutes } from './tenant/routes';
import { UserRoutes } from './user/routes';

import { renderRoutes } from '@/router';

export const SystemRoutes = () => {
  const routes = [
    { path: 'dictionary/*', element: <DictionaryRoutes /> },
    { path: 'group/*', element: <GroupRoutes /> },
    { path: 'user/*', element: <UserRoutes /> },
    { path: 'permission/*', element: <PermissionRoutes /> },
    { path: 'menu/*', element: <MenuRoutes /> },
    { path: 'role/*', element: <RoleRoutes /> },
    { path: 'tenant/*', element: <TenantRoutes /> },
    { path: 'basic/*', element: <BasicRoutes /> }
  ];
  return renderRoutes(routes);
};

export default SystemRoutes;
