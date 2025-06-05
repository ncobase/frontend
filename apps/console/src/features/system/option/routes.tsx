import { OptionListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const OptionRoutes = () => {
  const routes = [
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
