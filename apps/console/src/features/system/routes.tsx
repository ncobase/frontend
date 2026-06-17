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
    {
      path: 'dictionaries/*',
      element: (
        <Guard
          permissions={['read:dictionaries', 'manage:dictionary', 'manage:system']}
          any
          children={<DictionaryRoutes />}
        />
      )
    },
    {
      path: 'orgs/*',
      element: (
        <Guard
          permissions={['read:organizations', 'manage:organizations']}
          any
          children={<OrgRoutes />}
        />
      )
    },
    {
      path: 'users/*',
      element: (
        <Guard
          permissions={[
            'read:users',
            'create:users',
            'update:users',
            'delete:users',
            'manage:users',
            'read:employees',
            'create:employees',
            'update:employees',
            'manage:employees',
            'manage:hr'
          ]}
          any
          children={<UserRoutes />}
        />
      )
    },
    {
      path: 'permissions/*',
      element: (
        <Guard
          permissions={['read:permissions', 'manage:permissions']}
          any
          children={<PermissionRoutes />}
        />
      )
    },
    { path: 'menus/*', element: <Guard permission='manage:menu' children={<MenuRoutes />} /> },
    {
      path: 'roles/*',
      element: <Guard permissions={['read:roles', 'manage:roles']} any children={<RoleRoutes />} />
    },
    {
      path: 'basics/*',
      element: (
        <Guard permissions={['manage:system', 'admin:system']} any children={<BasicRoutes />} />
      )
    },
    {
      path: 'options/*',
      element: (
        <Guard permissions={['read:system', 'manage:system']} any children={<OptionRoutes />} />
      )
    }
  ];
  return renderRoutes(routes);
};

export default SystemRoutes;
