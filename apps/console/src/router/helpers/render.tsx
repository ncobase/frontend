import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { ErrorPage } from '@/components/errors';

interface RouteData {
  path: string;
  element: JSX.Element;
  children?: RouteData[];
}

const renderRoute = (route: RouteData) => {
  if (route.children) {
    return (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.children.map(childRoute => renderRoute(childRoute))}
      </Route>
    );
  }
  return <Route key={route.path} path={route.path} element={route.element} />;
};

export const renderRoutes = (routesData: RouteData[], withRoutes = true) => {
  if (!withRoutes) {
    return (
      <>
        {routesData.map(route => renderRoute(route))}
        <Route path='*' element={<ErrorPage code={404} />} />
      </>
    );
  }
  return (
    <Routes>
      {routesData.map(route => renderRoute(route))}
      <Route path='*' element={<ErrorPage code={404} />} />
    </Routes>
  );
};
