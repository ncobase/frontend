import { lazyNamed, renderRoutes } from '@/router';

const Profile = lazyNamed(() => import('./pages/profile'), 'Profile');
const SessionPage = lazyNamed(() => import('./pages/session'), 'SessionPage');

export const AccountRoutes = () => {
  const routes = [
    { path: '/profile', element: <Profile /> },
    { path: '/sessions', element: <SessionPage /> }
  ];
  return renderRoutes(routes);
};

export default AccountRoutes;
