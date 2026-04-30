import { lazyNamed, renderRoutes } from '@/router';

const SystemSettingsPage = lazyNamed(() => import('./system'), 'SystemSettingsPage');

export const BasicRoutes = () => {
  const routes = [{ path: '/', element: <SystemSettingsPage /> }];
  return renderRoutes(routes);
};

export default BasicRoutes;
