import { TemplateCreatePage } from './pages/create';
import { TemplateEditPage } from './pages/edit';
import { TemplateListPage } from './pages/list';
import { TemplateMarketPage } from './pages/market';
import { TemplateViewPage } from './pages/view';

import { renderRoutes } from '@/router';

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
