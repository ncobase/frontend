import React from 'react';

import { Warehouse } from './warehouse';

import { renderRoutes } from '@/router';

export const WarehouseRoutes = () => {
  const routes = [{ path: '/', element: <Warehouse /> }];
  return renderRoutes(routes);
};
