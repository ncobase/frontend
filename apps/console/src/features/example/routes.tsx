import { AnalyzePage } from './analyze';
import { AuthExample } from './auth';
import { ExampleCardRoutes } from './card';
import { Masonry } from './card/masonry';
import { I18nExample } from './i18n';
import { ListPage, ListPage2 } from './list';
import { LoadingStatesExample } from './loading';
import { NotificationExample } from './notification/notification';
import { PortalExample } from './portal/portal';
import { ResponsiveDesignExample } from './responsive';
import { AdvancedSearchExample } from './search';
import { ThemeSwitcherExample } from './theme';
import { ExampleUIRoutes } from './ui';

import { renderRoutes } from '@/router';

export const ExampleRoutes = () => {
  const routes = [
    { path: 'list-1', element: <ListPage /> },
    { path: 'list-2', element: <ListPage2 /> },
    { path: 'card/*', element: <ExampleCardRoutes /> },
    { path: 'masonry', element: <Masonry /> },
    { path: 'analyze', element: <AnalyzePage /> },
    { path: 'ui/*', element: <ExampleUIRoutes /> },
    { path: 'responsive', element: <ResponsiveDesignExample /> },
    { path: 'theme', element: <ThemeSwitcherExample /> },
    { path: 'i18n', element: <I18nExample /> },
    { path: 'search', element: <AdvancedSearchExample /> },
    { path: 'auth', element: <AuthExample /> },
    { path: 'loading', element: <LoadingStatesExample /> },
    { path: 'portal', element: <PortalExample /> },
    { path: 'notifcation', element: <NotificationExample /> }
  ];
  return renderRoutes(routes);
};

export default ExampleRoutes;
