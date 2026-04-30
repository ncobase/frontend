import { lazyNamed, renderRoutes } from '@/router';

const TemplateCreatePage = lazyNamed(() => import('./pages/create'), 'TemplateCreatePage');
const TemplateEditPage = lazyNamed(() => import('./pages/edit'), 'TemplateEditPage');
const TemplateListPage = lazyNamed(() => import('./pages/list'), 'TemplateListPage');
const TemplateMarketPage = lazyNamed(() => import('./pages/market'), 'TemplateMarketPage');
const TemplateViewPage = lazyNamed(() => import('./pages/view'), 'TemplateViewPage');

export const TemplateRoutes = () => {
  const routes = [
    { path: '/', element: <TemplateListPage /> },
    { path: '/create', element: <TemplateCreatePage /> },
    { path: '/market', element: <TemplateMarketPage /> },
    { path: '/:id', element: <TemplateViewPage /> },
    { path: '/:id/edit', element: <TemplateEditPage /> }
  ];
  return renderRoutes(routes);
};

export default TemplateRoutes;
