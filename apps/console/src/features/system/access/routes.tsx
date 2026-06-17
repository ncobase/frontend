import { lazy } from 'react';

import { Routes, Route } from 'react-router';

import { Guard } from '@/router';

const CasbinPolicyPage = lazy(() => import('./pages/casbin'));
const ActivityListPage = lazy(() => import('./pages/activity'));

export const AccessRoutes = () => {
  const routes = [
    { path: '/policies', element: <Guard super children={<CasbinPolicyPage />} /> },
    {
      path: '/activities',
      element: (
        <Guard permissions={['read:system', 'manage:system']} any children={<ActivityListPage />} />
      )
    },
    {
      path: '/activities/:mode',
      element: (
        <Guard permissions={['read:system', 'manage:system']} any children={<ActivityListPage />} />
      )
    }
  ];

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AccessRoutes;
