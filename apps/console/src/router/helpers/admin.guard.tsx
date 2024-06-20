import React from 'react';

import { ErrorBoundary } from '@/components/error-boundary';
import { Spinner } from '@/components/spinner';
import { useAccount } from '@/features/account/service';

export const AdminGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAdministered, isLoading } = useAccount();

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAdministered) {
    return <div className='text-center text-gray-400 mt-24'>403 - Forbidden</div>;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};
