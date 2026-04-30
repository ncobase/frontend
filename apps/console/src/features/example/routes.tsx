import { lazyNamed, renderRoutes } from '@/router';

const AnalyzePage = lazyNamed(() => import('./analyze/analyze'), 'AnalyzePage');
const AuthExample = lazyNamed(() => import('./auth'), 'AuthExample');
const ExampleCardRoutes = lazyNamed(() => import('./card/routes'), 'ExampleCardRoutes');
const Masonry = lazyNamed(() => import('./card/masonry'), 'Masonry');
const I18nExample = lazyNamed(() => import('./i18n'), 'I18nExample');
const ListPage = lazyNamed(() => import('./list/list'), 'ListPage');
const ListPage2 = lazyNamed(() => import('./list/list2'), 'ListPage2');
const LoadingStatesExample = lazyNamed(() => import('./loading'), 'LoadingStatesExample');
const NotificationExample = lazyNamed(
  () => import('./notification/notification'),
  'NotificationExample'
);
const PortalExample = lazyNamed(() => import('./portal/portal'), 'PortalExample');
const ResponsiveDesignExample = lazyNamed(() => import('./responsive'), 'ResponsiveDesignExample');
const AdvancedSearchExample = lazyNamed(() => import('./search'), 'AdvancedSearchExample');
const ThemeSwitcherExample = lazyNamed(() => import('./theme'), 'ThemeSwitcherExample');
const ExampleUIRoutes = lazyNamed(() => import('./ui/routes'), 'ExampleUIRoutes');

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
