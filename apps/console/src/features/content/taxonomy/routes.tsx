import React from 'react';

import { TaxonomyListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const TaxonomyRoutes = () => {
  const routes = [
    { path: '/', element: <TaxonomyListPage /> },
    { path: '/:mode', element: <TaxonomyListPage /> },
    { path: '/:mode/:slug', element: <TaxonomyListPage /> }
  ];
  return renderRoutes(routes);
};

export default TaxonomyRoutes;
