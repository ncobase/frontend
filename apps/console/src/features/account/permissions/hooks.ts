import { useCallback, useMemo } from 'react';

import { Permission } from './service';

export interface UsePermissionsResult {
  hasRole: (_role: string | string[]) => boolean;
  hasPermission: (_permission: string) => boolean;
  hasMenuPermission: (_menuPerms?: string) => boolean;
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
  canAccessMenu: (_menu: {
    perms?: string;
    path?: string;
    disabled?: boolean;
    hidden?: boolean;
  }) => boolean;
  filterMenusByPermission: <T extends { perms?: string; disabled?: boolean; hidden?: boolean }>(
    _menus: T[]
  ) => T[];
}

export const usePermissions = (): UsePermissionsResult => {
  const hasRole = useCallback((role: string | string[]): boolean => Permission.hasRole(role), []);

  const hasPermission = useCallback(
    (permission: string): boolean => Permission.hasPermission(permission),
    []
  );

  const hasMenuPermission = useCallback((menuPerms?: string): boolean => {
    if (!menuPerms || menuPerms.trim() === '') {
      return true; // No permission required
    }
    return Permission.hasPermission(menuPerms);
  }, []);

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

  const canAccessMenu = useCallback(
    (menu: { perms?: string; path?: string; disabled?: boolean; hidden?: boolean }): boolean => {
      // Check if menu is disabled or hidden
      if (menu.disabled || menu.hidden) {
        return false;
      }

      // Admin can access all menus
      if (Permission.isAdmin()) {
        return true;
      }

      // Check permission requirement
      if (!menu.perms || menu.perms.trim() === '') {
        return true; // No permission required
      }

      return Permission.hasPermission(menu.perms);
    },
    []
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
      hasMenuPermission,
      isAdmin,
      getCurrentTenantId,
      getRoles,
      getPermissions,
      canAccess,
      canAccessMenu,
      filterMenusByPermission
    }),
    [
      hasRole,
      hasPermission,
      hasMenuPermission,
      isAdmin,
      getCurrentTenantId,
      getRoles,
      getPermissions,
      canAccess,
      canAccessMenu,
      filterMenusByPermission
    ]
  );
};

// Menu permissions hooks
export const useMenuPermissions = () => {
  const { hasMenuPermission, canAccessMenu, filterMenusByPermission, isAdmin } = usePermissions();

  const checkMenuAccess = useCallback(
    (menu: {
      perms?: string;
      path?: string;
      disabled?: boolean;
      hidden?: boolean;
      children?: any[];
    }): boolean => {
      return canAccessMenu(menu);
    },
    [canAccessMenu]
  );

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
    hasMenuPermission,
    checkMenuAccess,
    canAccessMenu,
    filterMenusByPermission,
    filterMenuTree,
    isAdmin
  };
};

// Route permissions hooks
export const useRoutePermissions = () => {
  const { hasPermission, canAccess, isAdmin } = usePermissions();

  const canAccessRoute = useCallback(
    (path: string, requiredPermission?: string): boolean => {
      // Admin can access all routes
      if (isAdmin()) {
        return true;
      }

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
    canAccess,
    isAdmin
  };
};
