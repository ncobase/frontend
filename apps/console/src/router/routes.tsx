import React from 'react';

import { Route, Navigate } from 'react-router-dom';

import { PublicGuard, AuthenticatedGuard, AdminGuard, renderRoutes } from './helpers';

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
import { CustomerRoutes } from '@/features/customer/routes';
import { DashRoutes } from '@/features/dash/routes';
import { ExampleRoutes } from '@/features/example/routes';
import { FinanceRoutes } from '@/features/finance/routes';
import { HrRoutes } from '@/features/hr/routes';
import { PurchaseRoutes } from '@/features/purchase/routes';
import { SaleRoutes } from '@/features/sale/routes';
import { SystemRoutes } from '@/features/system/routes';
import { WarehouseRoutes } from '@/features/warehouse/routes';

const routes = [
  { path: '/', element: <Navigate to='/dash' replace /> },
  { path: '/register', element: <PublicGuard children={<Register />} /> },
  { path: '/login', element: <PublicGuard children={<Login />} /> },
  { path: '/forget-password', element: <PublicGuard children={<ForgetPassword />} /> },
  { path: '/logout', element: <Logout /> },
  { path: '/dash/*', element: <AuthenticatedGuard children={<DashRoutes />} /> },
  { path: '/account/*', element: <AuthenticatedGuard children={<AccountRoutes />} /> },
  { path: '/content/*', element: <AuthenticatedGuard children={<ContentRoutes />} /> },
  { path: '/sale/*', element: <AuthenticatedGuard children={<SaleRoutes />} /> },
  { path: '/purchase/*', element: <AuthenticatedGuard children={<PurchaseRoutes />} /> },
  { path: '/finance/*', element: <AuthenticatedGuard children={<FinanceRoutes />} /> },
  { path: '/warehouse/*', element: <AuthenticatedGuard children={<WarehouseRoutes />} /> },
  { path: '/customer/*', element: <AuthenticatedGuard children={<CustomerRoutes />} /> },
  { path: '/hr/*', element: <AuthenticatedGuard children={<HrRoutes />} /> },
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
