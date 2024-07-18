import React from 'react';

import { CommentListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const CommentRoutes = () => {
  const routes = [{ path: '/', element: <CommentListPage /> }];
  return renderRoutes(routes);
};

export default CommentRoutes;
