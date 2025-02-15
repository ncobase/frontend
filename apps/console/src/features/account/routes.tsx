import { Profile } from './pages/profile';

import { renderRoutes } from '@/router';

export const AccountRoutes = () => {
  const routes = [{ path: '/profile', element: <Profile /> }];
  return renderRoutes(routes);
};

export default AccountRoutes;
