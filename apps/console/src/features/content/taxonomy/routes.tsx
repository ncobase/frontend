import React from 'react';

import { TaxonomyListPage } from './pages/taxonomy.list';

import { renderRoutes } from '@/router';

export const TaxonomyRoutes = () => {
  const routes = [{ path: '/', element: <TaxonomyListPage /> }];
  return renderRoutes(routes);
};

export default TaxonomyRoutes;
