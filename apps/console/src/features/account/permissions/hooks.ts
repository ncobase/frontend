import { useCallback } from 'react';

import { Permission } from './service';

export interface UsePermissionsResult {
  hasRole: (_role: string | string[]) => boolean;
  hasPermission: (_permission: string) => boolean;
  isAdmin: () => boolean;
  getCurrentTenantId: () => string;
  getRoles: () => string[];
  getPermissions: () => string[];
  canAccess: (_options: {
    permission?: string;
    role?: string;
    any?: boolean;
    permissions?: string[];
    roles?: string[];
  }) => boolean;
}

export const usePermissions = (): UsePermissionsResult => {
  const hasRole = useCallback((role: string | string[]): boolean => Permission.hasRole(role), []);

  const hasPermission = useCallback(
    (permission: string): boolean => Permission.hasPermission(permission),
    []
  );

  const isAdmin = useCallback((): boolean => Permission.isAdmin(), []);

  const getCurrentTenantId = useCallback((): string => Permission.getCurrentTenantId(), []);

  const getRoles = useCallback((): string[] => Permission.getRoles(), []);

  const getPermissions = useCallback((): string[] => Permission.getPermissions(), []);

  const canAccess = useCallback(
    (options: {
      permission?: string;
      role?: string;
      any?: boolean;
      permissions?: string[];
      roles?: string[];
    }): boolean => Permission.canAccess(options),
    []
  );

  return {
    hasRole,
    hasPermission,
    isAdmin,
    getCurrentTenantId,
    getRoles,
    getPermissions,
    canAccess
  };
};
