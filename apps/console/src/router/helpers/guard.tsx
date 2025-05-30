import React, { useEffect, useState } from 'react';

import { useLocation, Navigate } from 'react-router';

import { ErrorBoundary } from '@/components/error-boundary';
import { Error403 } from '@/components/errors/403';
import { Spinner } from '@/components/loading/spinner';
import { useAuthContext } from '@/features/account/context';
import { usePermissions } from '@/features/account/permissions';
import { useAccount } from '@/features/account/service';

interface GuardProps {
  public?: boolean;
  admin?: boolean;
  super?: boolean;

  // Permission-based access control
  permission?: string;
  role?: string;
  any?: boolean;
  permissions?: string[];
  roles?: string[];

  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const Guard: React.FC<GuardProps> = ({
  public: isPublic = false,
  admin: requiresAdmin = false,
  super: requiresSuper = false,
  permission,
  role,
  any = false,
  permissions = [],
  roles = [],
  children,
  fallback = null,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { isAdmin: hasAdminPrivileges, isSuperAdmin, isLoading: isAccountLoading } = useAccount();
  const { canAccess } = usePermissions();
  const { pathname, search } = useLocation();
  const [accessDenied, setAccessDenied] = useState(false);

  // Reset access denied state when route changes
  useEffect(() => {
    setAccessDenied(false);
  }, [pathname]);

  // Check access permissions
  const canAccessRoute = (): boolean => {
    // Server-side access denial takes precedence
    if (accessDenied) return false;

    // Public routes are always accessible
    if (isPublic) return true;

    // Authentication required for protected routes
    if (!isAuthenticated) return false;

    // Admin role requirement
    if (requiresAdmin && !hasAdminPrivileges) return false;

    // Super admin role requirement
    if (requiresSuper && !isSuperAdmin) return false;

    // Permission-based access control
    try {
      return canAccess({
        permission,
        role,
        any,
        permissions,
        roles
      });
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading || isAccountLoading) {
    return <Spinner />;
  }

  // Handle authenticated users on public routes
  if (isPublic && isAuthenticated) {
    // Redirect login/register to home if already authenticated
    if (pathname === '/login' || pathname === '/register') {
      return <Navigate to='/' replace />;
    }
  }

  // Handle access denial
  if (!canAccessRoute()) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!isAuthenticated) {
      // Redirect to login with return URL
      return (
        <Navigate to={`${redirectTo}?redirect=${encodeURIComponent(pathname + search)}`} replace />
      );
    }

    // Show 403 error for authenticated but unauthorized users
    return <Error403 />;
  }

  // Grant access with error boundary
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
