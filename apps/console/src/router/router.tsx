import { Suspense } from 'react';

import { BrowserRouter } from 'react-router';

import { Routes } from './routes';

import { Layout } from '@/components/layout';
import { Spinner } from '@/components/loading/spinner';

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
