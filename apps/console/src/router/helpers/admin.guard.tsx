import React from 'react';

import { ErrorBoundary } from '@/components/error-boundary';
import { Error403 } from '@/components/errors/403';
import { Error500 } from '@/components/errors/500';
import { Spinner } from '@/components/loading/spinner';
import { useAccount } from '@/features/account/service';

export const AdminGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAdministered, isLoading, isError } = useAccount();
  if (isError) {
    return <Error500 to='/logout' />;
  }
  if (isLoading) {
    return <Spinner />;
  }
  if (!isAdministered) {
    return <Error403 to='/logout' />;
  }
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
