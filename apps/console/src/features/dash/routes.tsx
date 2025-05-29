import { ExtensionMetricsPage } from '../system/extension/pages/metrics';

import { renderRoutes } from '@/router';

export const DashRoutes = () => {
  const routes = [{ path: '/', element: <ExtensionMetricsPage /> }];
  return renderRoutes(routes);
};

export default DashRoutes;
