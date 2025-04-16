import { AnalyzePage } from '../example/analyze';

import { renderRoutes } from '@/router';

export const DashRoutes = () => {
  const routes = [{ path: '/', element: <AnalyzePage sidebar={false} /> }];
  return renderRoutes(routes);
};

export default DashRoutes;
