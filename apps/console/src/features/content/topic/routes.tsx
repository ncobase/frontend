import React from 'react';

import { TopicListPage } from './pages/topic.list';

import { renderRoutes } from '@/router';

export const TopicRoutes = () => {
  const routes = [{ path: '/', element: <TopicListPage /> }];
  return renderRoutes(routes);
};

export default TopicRoutes;
