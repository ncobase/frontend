import React from 'react';

import { Customer } from './customer';

import { renderRoutes } from '@/router';

export const CustomerRoutes = () => {
  const routes = [{ path: '/', element: <Customer /> }];
  return renderRoutes(routes);
};
