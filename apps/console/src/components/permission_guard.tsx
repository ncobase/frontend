import React from 'react';

import { usePermissions } from '@/features/account/permissions';

interface PermissionGuardProps {
  permission?: string;
  role?: string;
  any?: boolean; // If true, checks if user has any of the permissions/roles instead of all
  permissions?: string[];
  roles?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
// Permission guard component
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  role,
  any = false,
  permissions = [],
  roles = [],
  children,
  fallback = null
}) => {
  const { hasPermission, hasRole, isAdmin } = usePermissions();

  const canAccess = () => {
    // Admin has access to everything
    if (isAdmin()) return true;

    // Single permission check
    if (permission && !hasPermission(permission)) return false;

    // Single role check
    if (role && !hasRole(role)) return false;

    // Multiple permissions check
    if (permissions.length > 0) {
      if (any) {
        // Any permission is sufficient
        if (!permissions.some(p => hasPermission(p))) return false;
      } else {
        // All permissions are required
        if (!permissions.every(p => hasPermission(p))) return false;
      }
    }

    // Multiple roles check
    if (roles.length > 0) {
      if (any) {
        // Any role is sufficient
        if (!roles.some(r => hasRole(r))) return false;
      } else {
        // All roles are required
        if (!roles.every(r => hasRole(r))) return false;
      }
    }

    return true;
  };

  return canAccess() ? <>{children}</> : <>{fallback}</>;
};
