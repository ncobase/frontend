import { Navigate } from 'react-router';

import { ExtensionListPage } from './pages/list';
import { ExtensionMetricsPage } from './pages/metrics';
import { ExtensionStatusPage } from './pages/status';

import { renderRoutes } from '@/router';

export const ExtensionRoutes = () => {
  const routes = [
    { path: '/', element: <Navigate to='metrics' replace /> },
    { path: '/metrics', element: <ExtensionMetricsPage /> },
    { path: '/list', element: <ExtensionListPage /> },
    { path: '/status', element: <ExtensionStatusPage /> }
  ];

  return renderRoutes(routes);
};

export default ExtensionRoutes;
