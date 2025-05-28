import { locals } from '@ncobase/utils';
import { jwtDecode } from 'jwt-decode';

import { ACCESS_TOKEN_KEY, TENANT_KEY } from '../context';
import { TokenPayload } from '../token_service';

export class Permission {
  private static accountData: {
    roles: string[];
    permissions: string[];
    isAdmin: boolean;
    tenantId: string;
    timestamp: number;
  } | null = null;

  // Token cache to avoid repeated decoding
  private static tokenCache: {
    token: string | null;
    decoded: TokenPayload | null;
    timestamp: number;
  } = {
    token: null,
    decoded: null,
    timestamp: 0
  };

  private static readonly CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes
  private static readonly PUBLIC_ROUTES = ['/login', '/register', '/forget-password', '/logout'];
  private static errorState = false;

  /**
   * Refresh permission state when tokens change
   */
  static refreshState(): void {
    this.tokenCache = {
      token: null,
      decoded: null,
      timestamp: 0
    };
    this.errorState = false;

    const token = locals.get(ACCESS_TOKEN_KEY);
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        this.tokenCache = {
          token,
          decoded,
          timestamp: Date.now()
        };
      } catch (error) {
        console.error('Failed to decode token during refresh:', error);
        this.errorState = true;
      }
    }
  }

  /**
   * Get decoded token with caching and error handling
   */
  static getDecodedToken(): TokenPayload | null {
    if (this.errorState) return null;

    const token = locals.get(ACCESS_TOKEN_KEY);
    if (!token) return null;

    // Return cached token if valid
    const { token: cachedToken, decoded, timestamp } = this.tokenCache;
    if (cachedToken === token && decoded && Date.now() - timestamp < this.CACHE_EXPIRATION) {
      return decoded;
    }

    // Decode new token
    try {
      const newDecoded = jwtDecode<TokenPayload>(token);
      this.tokenCache = {
        token,
        decoded: newDecoded,
        timestamp: Date.now()
      };
      this.errorState = false;
      return newDecoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      this.errorState = true;
      locals.remove(ACCESS_TOKEN_KEY);
      return null;
    }
  }

  /**
   * Set account data from API response
   */
  static setAccountData(accountMeshes: any): void {
    if (!accountMeshes) return;

    this.accountData = {
      roles: accountMeshes.roles || [],
      permissions: accountMeshes.permissions || [],
      isAdmin: accountMeshes.is_admin || false,
      tenantId: accountMeshes.tenant_id || '',
      timestamp: Date.now()
    };
  }

  /**
   * Get permissions with account data fallback
   */
  static getPermissionsData(): {
    roles: string[];
    permissions: string[];
    isAdmin: boolean;
    tenantId: string;
  } | null {
    // Try token first
    const decoded = this.getDecodedToken();
    if (decoded) {
      return {
        roles: decoded.payload?.roles || [],
        permissions: decoded.payload?.permissions || [],
        isAdmin: decoded.payload?.is_admin || false,
        tenantId: decoded.payload?.tenant_id || ''
      };
    }

    // Fallback to account data
    if (this.accountData) {
      return this.accountData;
    }

    return null;
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: string | string[]): boolean {
    const permissions = this.getPermissionsData();
    if (!permissions) return false;

    if (Array.isArray(role)) {
      return role.some(r => permissions.roles.includes(r));
    }
    return permissions.roles.includes(role);
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(permission: string): boolean {
    const permissions = this.getPermissionsData();
    if (!permissions) return false;

    if (permissions.isAdmin) return true;

    const [action, resource] = permission.split(':');
    return permissions.permissions.some(perm => {
      if (perm === permission) return true;
      if (perm === `*:${resource}` || perm === `${action}:*` || perm === '*:*') return true;
      return false;
    });
  }

  /**
   * Check if user is admin
   */
  static isAdmin(): boolean {
    const permissions = this.getPermissionsData();
    return permissions?.isAdmin || false;
  }

  /**
   * Get current tenant ID
   */
  static getCurrentTenantId(): string {
    const activeTenantId = locals.get(TENANT_KEY);
    if (activeTenantId) return activeTenantId;
    const permissions = this.getPermissionsData();
    return permissions?.tenantId || '';
  }

  /**
   * Get user roles
   */
  static getRoles(): string[] {
    const permissions = this.getPermissionsData();
    return permissions?.roles || [];
  }

  /**
   * Get user permissions
   */
  static getPermissions(): string[] {
    const permissions = this.getPermissionsData();
    return permissions?.permissions || [];
  }

  /**
   * Combined access check
   */
  static canAccess({
    permission,
    role,
    any = false,
    permissions = [],
    roles = []
  }: {
    permission?: string;
    role?: string;
    any?: boolean;
    permissions?: string[];
    roles?: string[];
  }): boolean {
    if (this.errorState) return false;

    // Admin access
    if (this.isAdmin()) return true;

    // Single permission check
    if (permission && !this.hasPermission(permission)) return false;

    // Single role check
    if (role && !this.hasRole(role)) return false;

    // Multiple permissions check
    if (permissions.length > 0) {
      const hasPermissions = any
        ? permissions.some(p => this.hasPermission(p))
        : permissions.every(p => this.hasPermission(p));

      if (!hasPermissions) return false;
    }

    // Multiple roles check
    if (roles.length > 0) {
      const hasRoles = any ? roles.some(r => this.hasRole(r)) : roles.every(r => this.hasRole(r));

      if (!hasRoles) return false;
    }

    return true;
  }

  /**
   * Clear account data
   */
  static clearAccountData(): void {
    this.accountData = null;
  }

  /**
   * Check if route is public
   */
  static isPublicRoute(path: string): boolean {
    return (
      this.PUBLIC_ROUTES.includes(path) ||
      this.PUBLIC_ROUTES.some(route => {
        if (route.endsWith('/*')) {
          const baseRoute = route.slice(0, -2);
          return path.startsWith(baseRoute);
        }
        return false;
      })
    );
  }

  /**
   * Register additional public route
   */
  static registerPublicRoute(route: string): void {
    if (!this.PUBLIC_ROUTES.includes(route)) {
      this.PUBLIC_ROUTES.push(route);
    }
  }

  /**
   * Clear all permission state
   */
  static clearState(): void {
    locals.remove(ACCESS_TOKEN_KEY);
    this.errorState = false;
    this.accountData = null;
    this.refreshState();
  }

  /**
   * Check if in error state
   */
  static isInError(): boolean {
    return this.errorState;
  }
}
