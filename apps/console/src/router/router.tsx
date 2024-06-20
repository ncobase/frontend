import React, { Suspense } from 'react';

import { BrowserRouter } from 'react-router-dom';

import preloadRoutes from './preload';
import { Routes } from './routes';

import { Spinner } from '@/components/spinner';
import { Layout } from '@/layout';

preloadRoutes();

export const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Spinner />}>
          <Routes />
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};
