import { Profile } from './pages/profile';
import { SessionPage } from './pages/session';

import { renderRoutes } from '@/router';

export const AccountRoutes = () => {
  const routes = [
    { path: '/profile', element: <Profile /> },
    { path: '/sessions', element: <SessionPage /> }
  ];
  return renderRoutes(routes);
};

export default AccountRoutes;
