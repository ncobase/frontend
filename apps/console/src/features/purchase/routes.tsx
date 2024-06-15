import React from 'react';

import { Purchase } from './purchase';

import { renderRoutes } from '@/router';

export const PurchaseRoutes = () => {
  const routes = [{ path: '/', element: <Purchase /> }];
  return renderRoutes(routes);
};
