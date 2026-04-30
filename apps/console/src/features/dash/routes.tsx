import { lazyNamed, renderRoutes } from '@/router';

const AnalyzesPage = lazyNamed(() => import('../example/analyze'), 'AnalyzesPage');

export const DashRoutes = () => {
  const routes = [{ path: '/', element: <AnalyzesPage /> }];
  return renderRoutes(routes);
};

export default DashRoutes;
