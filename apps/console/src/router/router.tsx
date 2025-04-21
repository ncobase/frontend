import { lazy, Suspense } from 'react';

import { BrowserRouter, Navigate, Route } from 'react-router';

import { Guard, renderRoutes } from './helpers';

import { AnimatedSwitch } from '@/components/animate/switch';
import { ErrorPage } from '@/components/errors';
import { Layout } from '@/components/layout';
import { Spinner } from '@/components/loading/spinner';
// Auth pages
import { ForgetPassword } from '@/features/account/pages/auth/forget_password';
import { Login } from '@/features/account/pages/auth/login';
import { Logout } from '@/features/account/pages/logout';
import { Register } from '@/features/account/pages/register';
const AccountRoutes = lazy(() => import('@/features/account/routes'));
const BuilderRoutes = lazy(() => import('@/features/builder/routes'));
const ContentRoutes = lazy(() => import('@/features/content/routes'));
const DashRoutes = lazy(() => import('@/features/dash/routes'));
const ExampleRoutes = lazy(() => import('@/features/example/routes'));
const SystemRoutes = lazy(() => import('@/features/system/routes'));
// import { AccountRoutes } from '@/features/account/routes';
// import { BuilderRoutes } from '@/features/builder/routes';
// import { ContentRoutes } from '@/features/content/routes';
// import { DashRoutes } from '@/features/dash/routes';
// import { ExampleRoutes } from '@/features/example/routes';
// import { SystemRoutes } from '@/features/system/routes';

const routes = [
  { path: '/', element: <Navigate to='/dash' replace /> },
  {
    path: '/register',
    element: <Guard public>{<Register />}</Guard>
  },
  {
    path: '/login',
    element: <Guard public>{<Login />}</Guard>
  },
  {
    path: '/forget-password',
    element: <Guard public>{<ForgetPassword />}</Guard>
  },
  {
    path: '/logout',
    element: <Guard public>{<Logout />}</Guard>
  },
  {
    path: '/dash/*',
    element: <Guard>{<DashRoutes />}</Guard>
  },
  {
    path: '/account/*',
    element: <Guard>{<AccountRoutes />}</Guard>
  },
  {
    path: '/content/*',
    element: <Guard>{<ContentRoutes />}</Guard>
  },
  {
    path: '/system/*',
    element: <Guard admin>{<SystemRoutes />}</Guard>
  },
  {
    path: '/builder/*',
    element: <Guard permissions={['read:builder', 'write:builder']}>{<BuilderRoutes />}</Guard>
  },
  // Example of a route with granular permission control
  {
    path: '/example/*',
    element: (
      <Guard permissions={['read:example', 'write:example']} any>
        {<ExampleRoutes />}
      </Guard>
    )
  }
];

export const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Spinner />}>
          <AnimatedSwitch>
            {renderRoutes(routes, false)}
            <Route path='*' element={<ErrorPage code={404} />} />
          </AnimatedSwitch>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};
