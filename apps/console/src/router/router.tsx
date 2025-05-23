import { lazy, Suspense } from 'react';

import { BrowserRouter, Navigate, Route } from 'react-router';

import { Guard, renderRoutes } from './helpers';

import { AnimatedSwitch } from '@/components/animate/switch';
import { ErrorPage } from '@/components/errors';
import { Layout } from '@/components/layout';
import { Spinner } from '@/components/loading/spinner';
import { ErrorNotification } from '@/components/notifications';
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

const routes = [
  { path: '/', element: <Navigate to='/dash' replace /> },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forget-password',
    element: <ForgetPassword />
  },
  {
    path: '/logout',
    element: <Logout />
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
        <ErrorNotification />
      </Layout>
    </BrowserRouter>
  );
};
