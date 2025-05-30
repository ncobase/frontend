import { useCallback, useMemo } from 'react';

import { useAuthContext } from '../context';

export interface UsePermissionsResult {
  hasRole: (_role: string | string[]) => boolean;
  hasPermission: (_permission: string) => boolean;
  isAdmin: () => boolean;
  getRoles: () => string[];
  getPermissions: () => string[];
  canAccess: (_options: {
    permission?: string;
    role?: string;
    any?: boolean;
    permissions?: string[];
    roles?: string[];
  }) => boolean;
  canAccessMenu: (_menu: { perms?: string; disabled?: boolean; hidden?: boolean }) => boolean;
  filterMenusByPermission: <
    T extends {
      perms?: string;
      disabled?: boolean;
      hidden?: boolean;
    }
  >(
    _menus: T[]
  ) => T[];
}

export const usePermissions = (): UsePermissionsResult => {
  const { hasRole, hasPermission, roles, permissions, user } = useAuthContext();

  const isAdmin = useCallback((): boolean => {
    return user?.is_admin || false;
  }, [user]);

  const getRoles = useCallback((): string[] => {
    return roles;
  }, [roles]);

  const getPermissions = useCallback((): string[] => {
    return permissions;
  }, [permissions]);

  const canAccess = useCallback(
    (options: {
      permission?: string;
      role?: string;
      any?: boolean;
      permissions?: string[];
      roles?: string[];
    }): boolean => {
      // Admin has access to everything
      if (isAdmin()) return true;

      const {
        permission,
        role,
        any = false,
        permissions: reqPermissions = [],
        roles: reqRoles = []
      } = options;

      // Check single permission
      if (permission && !hasPermission(permission)) return false;

      // Check single role
      if (role && !hasRole(role)) return false;

      // Check multiple permissions
      if (reqPermissions.length > 0) {
        const hasPermissions = any
          ? reqPermissions.some(p => hasPermission(p))
          : reqPermissions.every(p => hasPermission(p));

        if (!hasPermissions) return false;
      }

      // Check multiple roles
      if (reqRoles.length > 0) {
        const hasRoles = any ? reqRoles.some(r => hasRole(r)) : reqRoles.every(r => hasRole(r));

        if (!hasRoles) return false;
      }

      return true;
    },
    [hasPermission, hasRole, isAdmin]
  );

  const canAccessMenu = useCallback(
    (menu: { perms?: string; disabled?: boolean; hidden?: boolean }): boolean => {
      // Check if menu is disabled or hidden
      if (menu.disabled || menu.hidden) return false;

      // Admin can access all menus
      if (isAdmin()) return true;

      // Check permission requirement
      if (!menu.perms || menu.perms.trim() === '') return true;

      return hasPermission(menu.perms);
    },
    [hasPermission, isAdmin]
  );

  const filterMenusByPermission = useCallback(
    <T extends { perms?: string; disabled?: boolean; hidden?: boolean }>(menus: T[]): T[] => {
      return menus.filter(menu => canAccessMenu(menu));
    },
    [canAccessMenu]
  );

  return useMemo(
    () => ({
      hasRole,
      hasPermission,
      isAdmin,
      getRoles,
      getPermissions,
      canAccess,
      canAccessMenu,
      filterMenusByPermission
    }),
    [
      hasRole,
      hasPermission,
      isAdmin,
      getRoles,
      getPermissions,
      canAccess,
      canAccessMenu,
      filterMenusByPermission
    ]
  );
};

// Menu permissions hook
export const useMenuPermissions = () => {
  const { canAccessMenu, filterMenusByPermission, isAdmin } = usePermissions();

  const filterMenuTree = useCallback(
    <
      T extends {
        perms?: string;
        disabled?: boolean;
        hidden?: boolean;
        children?: T[];
      }
    >(
      menus: T[]
    ): T[] => {
      return menus
        .filter(menu => canAccessMenu(menu))
        .map(menu => {
          if (menu.children && menu.children.length > 0) {
            return {
              ...menu,
              children: filterMenuTree(menu.children)
            };
          }
          return menu;
        });
    },
    [canAccessMenu]
  );

  return {
    canAccessMenu,
    filterMenusByPermission,
    filterMenuTree,
    isAdmin
  };
};

// Route permissions hook
export const useRoutePermissions = () => {
  const { hasPermission, isAdmin } = usePermissions();

  const canAccessRoute = useCallback(
    (path: string, requiredPermission?: string): boolean => {
      // Admin can access all routes
      if (isAdmin()) return true;

      // Check specific permission if provided
      if (requiredPermission) {
        return hasPermission(requiredPermission);
      }

      // Default route access logic based on path
      if (path.startsWith('/system/')) {
        return hasPermission('manage:system') || hasPermission('read:system');
      }

      if (path.startsWith('/user/')) {
        return hasPermission('manage:user') || hasPermission('read:user');
      }

      if (path.startsWith('/content/')) {
        return hasPermission('manage:content') || hasPermission('read:content');
      }

      // Default allow access if no specific permission required
      return true;
    },
    [hasPermission, isAdmin]
  );

  return {
    canAccessRoute,
    hasPermission,
    isAdmin
  };
};
