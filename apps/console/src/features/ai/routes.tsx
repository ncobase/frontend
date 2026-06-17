import { Navigate } from 'react-router';

import { lazyNamed, renderRoutes } from '@/router';
import { Guard } from '@/router/helpers/guard';

const AIOverviewPage = lazyNamed(() => import('./pages/overview'), 'AIOverviewPage');
const AIPlaygroundPage = lazyNamed(() => import('./pages/playground'), 'AIPlaygroundPage');
const AIActionsPage = lazyNamed(() => import('./pages/actions'), 'AIActionsPage');
const AIRunsPage = lazyNamed(() => import('./pages/runs'), 'AIRunsPage');
const AIRunViewPage = lazyNamed(() => import('./pages/run_view'), 'AIRunViewPage');
const AIProvidersPage = lazyNamed(() => import('./pages/providers'), 'AIProvidersPage');
const AIUsagePage = lazyNamed(() => import('./pages/usage'), 'AIUsagePage');

export const AIRoutes = () => {
  const routes = [
    { path: '/', element: <Navigate to='overview' replace /> },
    { path: '/overview', element: <AIOverviewPage /> },
    {
      path: '/playground',
      element: (
        <Guard
          permissions={['use:ai', 'manage:ai', 'admin:ai']}
          any
          children={<AIPlaygroundPage />}
        />
      )
    },
    {
      path: '/actions',
      element: (
        <Guard permissions={['use:ai', 'manage:ai', 'admin:ai']} any children={<AIActionsPage />} />
      )
    },
    { path: '/runs', element: <AIRunsPage /> },
    { path: '/runs/:id', element: <AIRunViewPage /> },
    { path: '/providers', element: <AIProvidersPage /> },
    { path: '/usage', element: <AIUsagePage /> }
  ];
  return renderRoutes(routes);
};

export default AIRoutes;
