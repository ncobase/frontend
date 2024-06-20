import React from 'react';

import { DictionaryListPage } from './pages/dictionary.list';

import { renderRoutes } from '@/router';

export const DictionaryRoutes = () => {
  const routes = [{ path: '/', element: <DictionaryListPage /> }];
  return renderRoutes(routes);
};

export default DictionaryRoutes;
