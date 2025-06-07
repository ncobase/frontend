import { SEOAnalyticsPage } from './pages/analytics';
import { SEOAuditPage } from './pages/audit';
import { SEODashboardPage } from './pages/dashboard';
import { SEOSettingsPage } from './pages/settings';

import { renderRoutes } from '@/router';

export const SEORoutes = () => {
  const routes = [
    { path: '/', element: <SEODashboardPage /> },
    { path: '/analytics', element: <SEOAnalyticsPage /> },
    { path: '/audit/:contentType/:contentId', element: <SEOAuditPage /> },
    { path: '/settings', element: <SEOSettingsPage /> }
  ];
  return renderRoutes(routes);
};

export default SEORoutes;
