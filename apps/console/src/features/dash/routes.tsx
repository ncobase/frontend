import { Analyzes } from './dashboard';

import { renderRoutes } from '@/router';

export const DashRoutes = () => {
  const routes = [{ path: '/', element: <Analyzes /> }];
  return renderRoutes(routes);
};

export default DashRoutes;
