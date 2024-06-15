import React from 'react';

import { Navigate } from 'react-router-dom';

import { ErrorBoundary } from '@/components/error-boundary';
import { useAuthContext } from '@/features/account/context';

export const PublicGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <Navigate to='/' replace /> : <ErrorBoundary>{children}</ErrorBoundary>;
};
