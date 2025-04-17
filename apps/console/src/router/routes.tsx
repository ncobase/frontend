import { Navigate, Route } from 'react-router';

import { Guard, renderRoutes } from './helpers';

import { AnimatedSwitch } from '@/components/animate/switch';
import { ErrorPage } from '@/components/errors';
import { ForgetPassword } from '@/features/account/pages/auth/forget_password';
import { Login } from '@/features/account/pages/auth/login';
import { Logout } from '@/features/account/pages/logout';
import { Register } from '@/features/account/pages/register';
// TODO: use react lazy loading
//  - Question 1: 是否有必要？存在页面刷新的问题，导致切换不流畅
//  - Question 2: 有没有更好的方法？主要目的是分割代码
// const AccountRoutes = lazy(() => import('@/features/account/routes'));
// const ContentRoutes = lazy(() => import('@/features/content/routes'));
// const DashRoutes = lazy(() => import('@/features/dash/routes'));
// const ExampleRoutes = lazy(() => import('@/features/example/routes'));
// const SystemRoutes = lazy(() => import('@/features/system/routes'));
import { AccountRoutes } from '@/features/account/routes';
import { ContentRoutes } from '@/features/content/routes';
import { DashRoutes } from '@/features/dash/routes';
import { ExampleRoutes } from '@/features/example/routes';
import { SystemRoutes } from '@/features/system/routes';

const routes = [
  { path: '/', element: <Navigate to='/dash' replace /> },
  { path: '/register', element: <Register /> },
  { path: '/login', element: <Login /> },
  { path: '/forget-password', element: <ForgetPassword /> },
  { path: '/logout', element: <Logout /> },
  { path: '/dash/*', element: <Guard children={<DashRoutes />} /> },
  { path: '/account/*', element: <Guard children={<AccountRoutes />} /> },
  { path: '/content/*', element: <Guard children={<ContentRoutes />} /> },
  {
    path: '/system/*',
    element: <Guard admin children={<SystemRoutes />} />
  },
  { path: '/example/*', element: <Guard children={<ExampleRoutes />} /> }
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
