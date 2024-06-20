import React from 'react';

import { AnalyzePage } from './analyze';
import { ExampleCardRoutes } from './card';
import { Masonry } from './card/masonry';
import { ListPage, ListPage2 } from './list';
import { ExampleUIRoutes } from './ui';

import { renderRoutes } from '@/router';

export const ExampleRoutes = () => {
  const routes = [
    { path: 'list-1', element: <ListPage /> },
    { path: 'list-2', element: <ListPage2 /> },
    { path: 'card/*', element: <ExampleCardRoutes /> },
    { path: 'masonry', element: <Masonry /> },
    { path: 'analyze', element: <AnalyzePage /> },
    { path: 'ui/*', element: <ExampleUIRoutes /> }
  ];
  return renderRoutes(routes);
};

export default ExampleRoutes;
