import { lazyNamed, renderRoutes } from '@/router';

const SEOAnalyticsPage = lazyNamed(() => import('./pages/analytics'), 'SEOAnalyticsPage');
const SEOAuditPage = lazyNamed(() => import('./pages/audit'), 'SEOAuditPage');
const SEODashboardPage = lazyNamed(() => import('./pages/dashboard'), 'SEODashboardPage');
const SEOSettingsPage = lazyNamed(() => import('./pages/settings'), 'SEOSettingsPage');

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
