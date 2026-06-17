import { Guard, lazyNamed, renderRoutes } from '@/router';

const EmployeesPage = lazyNamed(() => import('./pages/employees'), 'EmployeesPage');
const UserListPage = lazyNamed(() => import('./pages/list'), 'UserListPage');

export const UserRoutes = () => {
  const userPermissions = [
    'read:users',
    'create:users',
    'update:users',
    'delete:users',
    'manage:users'
  ];
  const employeePermissions = ['read:employees', 'manage:employees', 'manage:hr'];
  const routes = [
    {
      path: '/employees',
      element: <Guard permissions={employeePermissions} any children={<EmployeesPage />} />
    },
    {
      path: '/',
      element: <Guard permissions={userPermissions} any children={<UserListPage />} />
    },
    {
      path: '/:mode',
      element: <Guard permissions={userPermissions} any children={<UserListPage />} />
    },
    {
      path: '/:mode/:slug',
      element: <Guard permissions={userPermissions} any children={<UserListPage />} />
    }
  ];
  return renderRoutes(routes);
};

export default UserRoutes;
