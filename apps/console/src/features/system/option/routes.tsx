import { OptionListPage } from './pages/list';
import { RuntimeSettingsPage } from './pages/runtime';

import { renderRoutes } from '@/router';

export const OptionRoutes = () => {
  const routes = [
    {
      path: '/runtime-settings',
      element: <RuntimeSettingsPage />,
      meta: {
        title: 'Runtime Settings',
        description: 'Manage runtime system options'
      }
    },
    {
      path: '/',
      element: <OptionListPage />,
      meta: {
        title: 'System Options',
        description: 'Manage system configuration options'
      }
    },
    {
      path: '/:mode',
      element: <OptionListPage />,
      meta: {
        title: 'System Options',
        description: 'Manage system configuration options'
      }
    },
    {
      path: '/:mode/:id',
      element: <OptionListPage />,
      meta: {
        title: 'System Options',
        description: 'Manage system configuration options'
      }
    }
  ];
  return renderRoutes(routes);
};
