import React from 'react';

import { Finance } from './finance';

import { renderRoutes } from '@/router';

export const FinanceRoutes = () => {
  const routes = [{ path: '/', element: <Finance /> }];
  return renderRoutes(routes);
};
