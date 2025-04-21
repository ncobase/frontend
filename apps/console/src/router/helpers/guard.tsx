import React from 'react';

import { Navigate, useLocation } from 'react-router';

import { ErrorBoundary } from '@/components/error-boundary';
import { Error403 } from '@/components/errors/403';
import { Spinner } from '@/components/loading/spinner';
import { useAuthContext } from '@/features/account/context';
import { Permission } from '@/features/account/permissions';
import { useAccount } from '@/features/account/service';

interface GuardProps {
  // Role-based access control
  public?: boolean; // Public route - no auth required
  admin?: boolean; // Requires admin role
  super?: boolean; // Requires super admin role

  // Permission-based access control
  permission?: string;
  role?: string;
  any?: boolean;
  permissions?: string[];
  roles?: string[];

  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string; // Where to redirect if access denied
}

/**
 * Unified permission guard component
 * Handles both role-based route protection and granular permission checks
 */
export const Guard: React.FC<GuardProps> = ({
  // Route access props
  public: isPublic = false,
  admin: requiresAdmin = false,
  super: requiresSuper = false,

  // Granular permission props
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
  const { pathname, search } = useLocation();

  // Determine if access should be granted
  const canAccess = (): boolean => {
    // Route level access control

    // Public routes are always accessible
    if (isPublic) return true;

    // Non-public routes require authentication
    if (!isAuthenticated) return false;

    // Admin routes require admin privileges
    if (requiresAdmin && !hasAdminPrivileges) return false;

    // Super admin routes require super admin privileges
    if (requiresSuper && !isSuperAdmin) return false;

    // Granular permission checks using Permission Service
    return Permission.canAccess({
      permission,
      role,
      any,
      permissions,
      roles
    });
  };

  // Show loading state
  if (isLoading || isAccountLoading) {
    return <Spinner />;
  }

  // Handle public routes - redirect if already authenticated
  if (isPublic && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  // Access denied - show fallback or redirect
  if (!canAccess()) {
    if (fallback) {
      return <>{fallback}</>;
    } else if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return (
        <Navigate to={`${redirectTo}?redirect=${encodeURIComponent(pathname + search)}`} replace />
      );
    } else {
      // Show 403 error if authenticated but not authorized
      return <Error403 />;
    }
  }

  // Wrap children in error boundary
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
