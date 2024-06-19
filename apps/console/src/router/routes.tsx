import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { AdminGuard, AuthenticatedGuard, PublicGuard, renderRoutes } from './helpers';

import { AnimatedSwitch } from '@/components/animate/switch';
import { ErrorPage } from '@/components/errors';
import { ForgetPassword } from '@/features/account/pages/auth/forget_password';
import { Login } from '@/features/account/pages/auth/login';
import { Logout } from '@/features/account/pages/logout';
import { Register } from '@/features/account/pages/register';
// TODO: use react lazy loading
//  - Question 1: 是否有必要？存在页面刷新的问题，导致切换不流畅
//  - Question 2: 有没有更好的方法？主要目的是分割代码
import { AccountRoutes } from '@/features/account/routes';
import { ContentRoutes } from '@/features/content/routes';
import { DashRoutes } from '@/features/dash/routes';
import { ExampleRoutes } from '@/features/example/routes';
import { SystemRoutes } from '@/features/system/routes';

const routes = [
  { path: '/', element: <Navigate to='/dash' replace /> },
  { path: '/register', element: <PublicGuard children={<Register />} /> },
  { path: '/login', element: <PublicGuard children={<Login />} /> },
  { path: '/forget-password', element: <PublicGuard children={<ForgetPassword />} /> },
  { path: '/logout', element: <Logout /> },
  { path: '/dash/*', element: <AuthenticatedGuard children={<DashRoutes />} /> },
  { path: '/account/*', element: <AuthenticatedGuard children={<AccountRoutes />} /> },
  { path: '/content/*', element: <AuthenticatedGuard children={<ContentRoutes />} /> },
  { path: '/system/*', element: <AdminGuard children={<SystemRoutes />} /> },
  { path: '/example/*', element: <AuthenticatedGuard children={<ExampleRoutes />} /> }
];

export const publicRoutes = ['/login', '/register', '/forget-password', '/logout'];

export const Routes = () => {
  return (
    <AnimatedSwitch>
      {renderRoutes(routes, false)}
      <Route path='*' element={<ErrorPage code={404} />} />
    </AnimatedSwitch>
  );
};
