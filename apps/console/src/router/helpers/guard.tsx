import React, { useEffect, useState, useRef } from 'react';

import { Navigate, useLocation } from 'react-router';

import { ErrorBoundary } from '@/components/error-boundary';
import { Error403 } from '@/components/errors/403';
import { Spinner } from '@/components/loading/spinner';
import { useAuthContext } from '@/features/account/context';
import { Permission } from '@/features/account/permissions';
import { useAccount } from '@/features/account/service';
import { eventEmitter } from '@/lib/events';

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
  const [accessDenied, setAccessDenied] = useState(false);

  // Prevent duplicate forbidden event handling
  const lastForbiddenEvent = useRef<number>(0);
  const FORBIDDEN_EVENT_COOLDOWN = 2000; // 2 seconds

  // Listen for forbidden events from the request interceptor
  useEffect(() => {
    const handleForbidden = (data: { method?: string; url?: string; message?: string }) => {
      const now = Date.now();

      // Skip if within cooldown period
      if (now - lastForbiddenEvent.current < FORBIDDEN_EVENT_COOLDOWN) {
        return;
      }

      lastForbiddenEvent.current = now;

      // Set access denied only for authenticated users on protected routes
      if (isAuthenticated && !isPublic) {
        console.warn('Access forbidden by server:', data);
        setAccessDenied(true);
      }
    };

    // Listen for forbidden events only on protected routes
    if (isAuthenticated && !isPublic) {
      eventEmitter.on('forbidden', handleForbidden);
    }

    return () => {
      eventEmitter.off('forbidden', handleForbidden);
    };
  }, [isAuthenticated, isPublic]);

  // Reset access denied when route changes or authentication state changes
  useEffect(() => {
    setAccessDenied(false);
    lastForbiddenEvent.current = 0;
  }, [pathname, isAuthenticated]);

  // Determine if access should be granted
  const canAccess = (): boolean => {
    // If we've received a forbidden response from the server, deny access
    if (accessDenied) {
      return false;
    }

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
    try {
      return Permission.canAccess({
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

  // Show loading state
  if (isLoading || isAccountLoading) {
    return <Spinner />;
  }

  // Handle public routes - redirect if already authenticated (optional)
  if (isPublic && isAuthenticated) {
    // For login/register pages, redirect to home if already authenticated
    if (pathname === '/login' || pathname === '/register') {
      return <Navigate to='/' replace />;
    }
    // For other public routes, allow access even if authenticated
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
