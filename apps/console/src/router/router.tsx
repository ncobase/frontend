import React, { Suspense } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { SuspenseFallback } from './loadable';
import { Routes } from './routes';

import { Layout } from '@/layout';

export const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes />
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};
