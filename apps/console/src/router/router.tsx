import { Suspense } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { Routes } from './routes';

import { Spinner } from '@/components/loading/spinner';
import { Layout } from '@/layout';

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
