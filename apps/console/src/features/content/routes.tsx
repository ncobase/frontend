import { ChannelRoutes } from './channel/routes';
import { CommentRoutes } from './comment/routes';
import { ContentPage } from './content';
import { DistributionRoutes } from './distribution/routes';
import { MediaRoutes } from './media/routes';
import { ScheduleRoutes } from './schedule/routes';
import { SEORoutes } from './seo/routes';
import { TaxonomyRoutes } from './taxonomy/routes';
import { TemplateRoutes } from './template/routes';
import { TopicRoutes } from './topic/routes';
import { VersionRoutes } from './version/routes';
import { WorkflowRoutes } from './workflow/routes';

import { renderRoutes } from '@/router';

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
