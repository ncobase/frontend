import { lazyNamed, renderRoutes } from '@/router';

const VersionComparisonPage = lazyNamed(
  () => import('./pages/comparison'),
  'VersionComparisonPage'
);
const VersionHistoryPage = lazyNamed(() => import('./pages/history'), 'VersionHistoryPage');
const VersionSettingsPage = lazyNamed(() => import('./pages/settings'), 'VersionSettingsPage');

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
