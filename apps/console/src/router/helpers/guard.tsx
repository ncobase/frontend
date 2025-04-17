import { useEffect } from 'react';

import { Navigate, useLocation, useNavigate } from 'react-router';

import { ErrorBoundary } from '@/components/error-boundary';
import { Error403 } from '@/components/errors/403';
import { Spinner } from '@/components/loading/spinner';
import { useAuthContext } from '@/features/account/context';
import { useAccount } from '@/features/account/service';

interface GuardProps extends React.PropsWithChildren {
  /**
   * Is public route
   */
  public?: boolean;
  /**
   * Requires admin privileges
   */
  admin?: boolean;
  /**
   * Requires super admin privileges
   */
  super?: boolean;
}

export const Guard: React.FC<GuardProps> = ({
  children,
  public: isPublic = false,
  admin: isAdmin = false,
  super: isSuper = false
}) => {
  const { isAuthenticated } = useAuthContext();
  const { isAdmin: hasAdminPrivileges, isSuperAdmin, isLoading, isError } = useAccount();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  // Check if more than one condition is set
  const isInvalidConfig = [isPublic, isAdmin, isSuper].filter(Boolean).length > 1;

  if (isInvalidConfig) {
    console.warn('Guard: Only one of public, admin, or super should be true.');
    return null;
  }

  useEffect(() => {
    if (isError) {
      // Handle error (e.g., show toast message, navigate to an error page, etc.)
      navigate(`/login?redirect=${encodeURIComponent(pathname + search)}`, { replace: true });
    } else if (!isPublic && !isAuthenticated && !isLoading) {
      navigate(`/login?redirect=${encodeURIComponent(pathname + search)}`, { replace: true });
    }
  }, [isPublic, isAuthenticated, navigate, pathname, search, isLoading, isError]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isPublic && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  if (!isPublic && !isAuthenticated) {
    return null;
  }

  if (isAdmin && !hasAdminPrivileges) {
    return <Error403 />;
  }

  if (isSuper && !isSuperAdmin) {
    return <Error403 />;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};
