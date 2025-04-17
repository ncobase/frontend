import { useCallback } from 'react';

import { locals } from '@ncobase/utils';
import { jwtDecode } from 'jwt-decode';

import { ACCESS_TOKEN_KEY } from './context';
import { TokenPayload } from './token_service';

export const usePermissions = () => {
  const getDecodedToken = useCallback((): TokenPayload | null => {
    const token = locals.get(ACCESS_TOKEN_KEY);
    if (!token) return null;

    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }, []);

  const hasRole = useCallback(
    (role: string): boolean => {
      const decoded = getDecodedToken();
      if (!decoded) return false;

      return decoded.payload?.roles?.includes(role) || false;
    },
    [getDecodedToken]
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      const decoded = getDecodedToken();
      if (!decoded) return false;

      // Super admins have all permissions
      if (decoded.payload.is_admin) return true;

      if (!decoded.payload.permissions) return false;

      // Check for exact match first
      if (decoded.payload.permissions.includes(permission)) return true;

      // Check for wildcard permissions
      const [action, resource] = permission.split(':');

      // Check for action wildcard (e.g., "*:users" matches "read:users")
      if (decoded.payload.permissions.includes(`*:${resource}`)) return true;

      // Check for resource wildcard (e.g., "read:*" matches "read:users")
      if (decoded.payload.permissions.includes(`${action}:*`)) return true;

      // Check for full wildcard
      if (decoded.payload.permissions.includes('*')) return true;

      return false;
    },
    [getDecodedToken]
  );

  const isAdmin = useCallback((): boolean => {
    const decoded = getDecodedToken();
    if (!decoded) return false;

    return decoded.payload.is_admin || false;
  }, [getDecodedToken]);

  const getCurrentTenantId = useCallback((): string => {
    const decoded = getDecodedToken();
    if (!decoded) return '';

    return decoded.payload.tenant_id || '';
  }, [getDecodedToken]);

  return {
    hasRole,
    hasPermission,
    isAdmin,
    getCurrentTenantId,
    getRoles: () => getDecodedToken()?.payload.roles || [],
    getPermissions: () => getDecodedToken()?.payload.permissions || []
  };
};
