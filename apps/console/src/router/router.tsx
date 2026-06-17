import { lazy, Suspense } from 'react';

import { BrowserRouter, Navigate, Route } from 'react-router';

import { Guard, renderRoutes } from './helpers';

import { AnimatedSwitch } from '@/components/animate/switch';
import { ErrorBoundary } from '@/components/error-boundary';
import { ErrorPage } from '@/components/errors';
import { Layout } from '@/components/layout';
import { Spinner } from '@/components/loading/spinner';
import { ErrorNotification } from '@/components/notifications';
// Auth pages
import { ForgetPassword } from '@/features/account/pages/auth/forget_password';
import { Login } from '@/features/account/pages/auth/login';
import { Logout } from '@/features/account/pages/logout';
import { Register } from '@/features/account/pages/register';
import { filterRoutesByFeatureExposure } from '@/lib/features/exposure';
// Lazy loaded routes
const AccountRoutes = lazy(() => import('@/features/account/routes'));
const BuilderRoutes = lazy(() => import('@/features/builder/routes'));
const ContentRoutes = lazy(() => import('@/features/content/routes'));
const DashRoutes = lazy(() => import('@/features/dash/routes'));
const ExampleRoutes = lazy(() => import('@/features/example/routes'));
const SystemRoutes = lazy(() => import('@/features/system/routes'));
const NCoreRoutes = lazy(() => import('@/features/ncore/routes'));
const SpaceRoutes = lazy(() => import('@/features/space/routes'));
const ResourceRoutes = lazy(() => import('@/features/resource/routes'));
const PaymentRoutes = lazy(() => import('@/features/payment/routes'));
const AIRoutes = lazy(() => import('@/features/ai/routes'));

const routes = [
  { path: '/', element: <Navigate to='/dash' replace /> },

  // Public routes
  {
    path: '/register',
    element: (
      <Guard public>
        <Register />
      </Guard>
    )
  },
  {
    path: '/login',
    element: (
      <Guard public>
        <Login />
      </Guard>
    )
  },
  {
    path: '/forget-password',
    element: (
      <Guard public>
        <ForgetPassword />
      </Guard>
    )
  },
  { path: '/logout', element: <Logout /> },

  // Error routes - these should use layout for authenticated users
  {
    path: '/error/403',
    element: <ErrorPage code={403} />
  },
  {
    path: '/error/404',
    element: <ErrorPage code={404} />
  },
  {
    path: '/error/500',
    element: <ErrorPage code={500} />
  },
  {
    path: '/error/network',
    element: <ErrorPage code='network' />
  },

  // Protected routes
  {
    path: '/dash/*',
    element: (
      <Guard>
        <DashRoutes />
      </Guard>
    )
  },
  {
    path: '/account/*',
    element: (
      <Guard>
        <AccountRoutes />
      </Guard>
    )
  },
  {
    path: '/content/*',
    element: (
      <Guard permissions={['read:content', 'manage:content', 'read:cms', 'manage:cms']} any>
        <ContentRoutes />
      </Guard>
    )
  },
  {
    path: '/system/*',
    element: (
      <Guard
        permissions={[
          'read:system',
          'manage:system',
          'admin:system',
          'read:organizations',
          'manage:organizations',
          'read:users',
          'create:users',
          'update:users',
          'delete:users',
          'manage:users',
          'read:employees',
          'create:employees',
          'update:employees',
          'manage:employees',
          'manage:hr',
          'read:roles',
          'manage:roles',
          'read:permissions',
          'manage:permissions',
          'manage:menu',
          'read:dictionaries',
          'manage:dictionary'
        ]}
        any
      >
        <SystemRoutes />
      </Guard>
    )
  },
  {
    path: '/ncore/*',
    element: (
      <Guard permission='manage:ncore'>
        <NCoreRoutes />
      </Guard>
    )
  },
  {
    path: '/spaces/*',
    element: (
      <Guard permissions={['read:spaces', 'manage:spaces']} any>
        <SpaceRoutes />
      </Guard>
    )
  },
  {
    path: '/builder/*',
    element: (
      <Guard permission='manage:builder'>
        <BuilderRoutes />
      </Guard>
    )
  },
  {
    path: '/example/*',
    element: (
      <Guard>
        <ExampleRoutes />
      </Guard>
    )
  },
  {
    path: '/res/*',
    element: (
      <Guard permissions={['read:resources', 'manage:resources', 'admin:resources']} any>
        <ResourceRoutes />
      </Guard>
    )
  },
  {
    path: '/pay/*',
    element: (
      <Guard
        permissions={['read:payments', 'manage:payments', 'refund:payments', 'admin:payments']}
        any
      >
        <PaymentRoutes />
      </Guard>
    )
  },
  {
    path: '/ai/*',
    element: (
      <Guard permissions={['read:ai', 'use:ai', 'manage:ai', 'admin:ai']} any>
        <AIRoutes />
      </Guard>
    )
  }
];

const exposedRoutes = filterRoutesByFeatureExposure(routes);

export const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <AnimatedSwitch>
              {renderRoutes(exposedRoutes, false)}
              <Route path='*' element={<ErrorPage code={404} />} />
            </AnimatedSwitch>
          </Suspense>
          <ErrorNotification />
        </ErrorBoundary>
      </Layout>
    </BrowserRouter>
  );
};
