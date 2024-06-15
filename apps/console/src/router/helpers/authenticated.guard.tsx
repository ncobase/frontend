import React, { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { ErrorBoundary } from '@/components/error-boundary';
import { useAuthContext } from '@/features/account/context';

export const AuthenticatedGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(pathname + search)}`, {
        replace: true
      });
    }
  }, [isAuthenticated, navigate, pathname, search]);

  return !isAuthenticated ? null : <ErrorBoundary>{children}</ErrorBoundary>;
};
