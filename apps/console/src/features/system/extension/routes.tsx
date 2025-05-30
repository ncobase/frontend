import { Navigate } from 'react-router';

import { ExtensionCollectionsPage } from './pages/collections';
import { ExtensionHealthPage } from './pages/health';
import { ExtensionMetricsPage } from './pages/metrics';
import { ExtensionOverviewPage } from './pages/overview';

import { renderRoutes } from '@/router';

export const ExtensionRoutes = () => {
  const routes = [
    { path: '/', element: <Navigate to='overview' replace /> },
    { path: '/overview', element: <ExtensionOverviewPage /> },
    { path: '/metrics', element: <ExtensionMetricsPage /> },
    { path: '/health', element: <ExtensionHealthPage /> },
    { path: '/collections', element: <ExtensionCollectionsPage /> }
  ];

  return renderRoutes(routes);
};

export default ExtensionRoutes;
