import { lazy } from 'react';

import { lazyNamed, renderRoutes } from '@/router';

const ContentPage = lazyNamed(() => import('./content'), 'ContentPage');
const ChannelRoutes = lazy(() => import('./channel/routes'));
const CommentRoutes = lazy(() => import('./comment/routes'));
const DistributionRoutes = lazy(() => import('./distribution/routes'));
const MediaRoutes = lazy(() => import('./media/routes'));
const ScheduleRoutes = lazy(() => import('./schedule/routes'));
const SEORoutes = lazy(() => import('./seo/routes'));
const TaxonomyRoutes = lazy(() => import('./taxonomy/routes'));
const TemplateRoutes = lazy(() => import('./template/routes'));
const TopicRoutes = lazy(() => import('./topic/routes'));
const VersionRoutes = lazy(() => import('./version/routes'));
const WorkflowRoutes = lazy(() => import('./workflow/routes'));

export const ContentRoutes = () => {
  const routes = [
    { path: '/', element: <ContentPage /> },
    { path: '/topics/*', element: <TopicRoutes /> },
    { path: '/taxonomies/*', element: <TaxonomyRoutes /> },
    { path: '/channels/*', element: <ChannelRoutes /> },
    { path: '/distributions/*', element: <DistributionRoutes /> },
    { path: '/workflows/*', element: <WorkflowRoutes /> },
    { path: '/version/*', element: <VersionRoutes /> },
    { path: '/schedule/*', element: <ScheduleRoutes /> },
    { path: '/seo/*', element: <SEORoutes /> },
    { path: '/templates/*', element: <TemplateRoutes /> },
    { path: '/comments/*', element: <CommentRoutes /> },
    { path: '/media/*', element: <MediaRoutes /> },
    { path: '/trash/*', element: <TopicRoutes /> },
    { path: '/approval/*', element: <TopicRoutes /> },
    { path: '/component/*', element: <TopicRoutes /> }
  ];
  return renderRoutes(routes);
};

export default ContentRoutes;
