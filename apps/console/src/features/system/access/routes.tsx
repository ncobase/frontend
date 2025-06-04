import { lazy } from 'react';

import { Routes, Route } from 'react-router';

const CasbinPolicyPage = lazy(() => import('./pages/casbin'));
const ActivityListPage = lazy(() => import('./pages/activity'));

export const AccessRoutes = () => {
  const routes = [
    { path: '/policies', element: <CasbinPolicyPage /> },
    { path: '/activities', element: <ActivityListPage /> },
    { path: '/activities/:mode', element: <ActivityListPage /> }
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
