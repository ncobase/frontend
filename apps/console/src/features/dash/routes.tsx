import { AnalyzesPage } from '../example/analyze';

import { renderRoutes } from '@/router';

export const DashRoutes = () => {
  const routes = [{ path: '/', element: <AnalyzesPage /> }];
  return renderRoutes(routes);
};

export default DashRoutes;
