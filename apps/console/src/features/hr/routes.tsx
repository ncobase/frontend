import React from 'react';

import { Hr } from './hr';

import { renderRoutes } from '@/router';

export const HrRoutes = () => {
  const routes = [{ path: '/', element: <Hr /> }];
  return renderRoutes(routes);
};
