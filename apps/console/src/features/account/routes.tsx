import { lazyNamed, renderRoutes } from '@/router';

const Profile = lazyNamed(() => import('./pages/profile'), 'Profile');
const SecurityPage = lazyNamed(() => import('./pages/security'), 'SecurityPage');
const SessionPage = lazyNamed(() => import('./pages/session'), 'SessionPage');

export const AccountRoutes = () => {
  const routes = [
    { path: '/profile', element: <Profile /> },
    { path: '/security', element: <SecurityPage /> },
    { path: '/sessions', element: <SessionPage /> }
  ];
  return renderRoutes(routes);
};

export default AccountRoutes;
