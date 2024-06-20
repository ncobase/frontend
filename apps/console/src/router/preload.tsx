import React from 'react';
import '@/features/account/routes';
import '@/features/content/routes';
import '@/features/dash/routes';
import '@/features/example/routes';
import '@/features/system/routes';

const preloadRoutes = () => {
  React.lazy(() => import('@/features/account/routes'));
  React.lazy(() => import('@/features/content/routes'));
  React.lazy(() => import('@/features/dash/routes'));
  React.lazy(() => import('@/features/example/routes'));
  React.lazy(() => import('@/features/system/routes'));
};

export default preloadRoutes;
