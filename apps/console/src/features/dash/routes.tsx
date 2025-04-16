import { BusinessDashboard } from '../example/analyze';

import { renderRoutes } from '@/router';

export const DashRoutes = () => {
  const routes = [{ path: '/', element: <BusinessDashboard /> }];
  return renderRoutes(routes);
};

export default DashRoutes;
