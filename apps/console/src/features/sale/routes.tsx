import React from 'react';

import { Sale } from './sale';

import { renderRoutes } from '@/router';

export const SaleRoutes = () => {
  const routes = [{ path: '/', element: <Sale /> }];
  return renderRoutes(routes);
};
