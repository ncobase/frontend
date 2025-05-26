import { locals } from '@ncobase/utils';
import { jwtDecode } from 'jwt-decode';

import { ACCESS_TOKEN_KEY, TENANT_KEY } from '../context';
import { TokenPayload } from '../token_service';

export class Permission {
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
   * Check if user has specific role
   */
  static hasRole(role: string | string[]): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;

    if (Array.isArray(role)) {
      return role.some(r => this.hasRole(r));
    }

    return decoded.payload?.roles?.includes(role) || false;
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(permission: string): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;

    // Admin users have all permissions
    if (decoded.payload.is_admin) return true;

    if (!decoded.payload.permissions) return false;

    // Exact match
    if (decoded.payload.permissions.includes(permission)) return true;

    // Wildcard permission matching
    const [action, resource] = permission.split(':');

    return (
      decoded.payload.permissions.includes(`*:${resource}`) ||
      decoded.payload.permissions.includes(`${action}:*`) ||
      decoded.payload.permissions.includes('*:*')
    );
  }

  /**
   * Check if user is admin
   */
  static isAdmin(): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.payload.is_admin || false;
  }

  /**
   * Get current tenant ID
   */
  static getCurrentTenantId(): string {
    // Priority: active tenant from localStorage
    const activeTenantId = locals.get(TENANT_KEY);
    if (activeTenantId) return activeTenantId;

    // Fallback: tenant from token
    const decoded = this.getDecodedToken();
    return decoded?.payload.tenant_id || '';
  }

  /**
   * Get user roles
   */
  static getRoles(): string[] {
    const decoded = this.getDecodedToken();
    return decoded?.payload.roles || [];
  }

  /**
   * Get user permissions
   */
  static getPermissions(): string[] {
    const decoded = this.getDecodedToken();
    return decoded?.payload.permissions || [];
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
    this.refreshState();
  }

  /**
   * Check if in error state
   */
  static isInError(): boolean {
    return this.errorState;
  }
}
