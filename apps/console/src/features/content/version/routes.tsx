import { VersionComparisonPage } from './pages/comparison';
import { VersionHistoryPage } from './pages/history';
import { VersionSettingsPage } from './pages/settings';

import { renderRoutes } from '@/router';

export const VersionRoutes = () => {
  const routes = [
    { path: '/:contentType/:contentId/history', element: <VersionHistoryPage /> },
    {
      path: '/:contentType/:contentId/compare/:versionA/:versionB',
      element: <VersionComparisonPage />
    },
    { path: '/settings', element: <VersionSettingsPage /> }
  ];
  return renderRoutes(routes);
};

export default VersionRoutes;
