import { locals } from '@ncobase/utils';
import { jwtDecode } from 'jwt-decode';

import { ACCESS_TOKEN_KEY } from '../context';
import { TokenPayload } from '../token_service';

import { eventEmitter } from '@/lib/events';

// Define an event for permission state changes
const PERMISSION_STATE_CHANGED = 'permission:state:changed';

export class Permission {
  // Cache for decoded token to avoid repeated decoding
  private static decodedTokenCache: {
    token: string | null;
    decoded: TokenPayload | null;
    timestamp: number;
  } = {
    token: null,
    decoded: null,
    timestamp: 0
  };

  // Cache expiration time in milliseconds (5 minutes)
  private static CACHE_EXPIRATION = 5 * 60 * 1000;

  // List of routes that are public (can be accessed without authentication)
  private static PUBLIC_ROUTES = ['/login', '/register', '/forget-password', '/logout'];

  /**
   * Refresh the permission state
   * This should be called when the token changes (login, logout, token refresh)
   */
  static refreshState(): void {
    // Clear the decoded token cache
    this.decodedTokenCache = {
      token: null,
      decoded: null,
      timestamp: 0
    };

    // Get current token
    const token = locals.get(ACCESS_TOKEN_KEY);

    // Decode and cache the new token if it exists
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        this.decodedTokenCache = {
          token,
          decoded,
          timestamp: Date.now()
        };
      } catch (error) {
        console.error('Failed to decode token during refresh:', error);
      }
    }

    // Emit an event that permission state has changed
    // Components that rely on permissions can listen for this event
    // and update their state accordingly
    eventEmitter.emit(PERMISSION_STATE_CHANGED, {
      isAuthenticated: !!token,
      permissions: this.getPermissions(),
      roles: this.getRoles(),
      isAdmin: this.isAdmin()
    });

    // Log state refresh for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[Permission] State refreshed', {
        hasToken: !!token,
        permissions: this.getPermissions().length,
        roles: this.getRoles().length,
        isAdmin: this.isAdmin()
      });
    }
  }

  /**
   * Get decoded token from local storage with caching
   */
  static getDecodedToken(): TokenPayload | null {
    const token = locals.get(ACCESS_TOKEN_KEY);

    // If no token exists, return null
    if (!token) return null;

    // Check if we have a cached decoded token
    const cachedToken = this.decodedTokenCache.token;
    const cachedDecoded = this.decodedTokenCache.decoded;
    const cacheTimestamp = this.decodedTokenCache.timestamp;

    // If the token matches the cached token and the cache hasn't expired, return the cached decoded token
    if (
      cachedToken === token &&
      cachedDecoded &&
      Date.now() - cacheTimestamp < this.CACHE_EXPIRATION
    ) {
      return cachedDecoded;
    }

    // Otherwise, decode the token and update the cache
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      this.decodedTokenCache = {
        token,
        decoded,
        timestamp: Date.now()
      };
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Check if user has a specific role
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
   * Check if user has a specific permission
   */
  static hasPermission(permission: string): boolean {
    const decoded = this.getDecodedToken();
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
  }

  /**
   * Check if user is an admin
   */
  static isAdmin(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;

    return decoded.payload.is_admin || false;
  }

  /**
   * Get current tenant ID
   */
  static getCurrentTenantId(): string {
    const decoded = this.getDecodedToken();
    if (!decoded) return '';

    return decoded.payload.tenant_id || '';
  }

  /**
   * Get all user roles
   */
  static getRoles(): string[] {
    const decoded = this.getDecodedToken();
    return decoded?.payload.roles || [];
  }

  /**
   * Get all user permissions
   */
  static getPermissions(): string[] {
    const decoded = this.getDecodedToken();
    return decoded?.payload.permissions || [];
  }

  /**
   * Check if user can access with combined permission/role check
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
    // Admin has access to everything
    if (this.isAdmin()) return true;

    // Single permission check
    if (permission && !this.hasPermission(permission)) return false;

    // Single role check
    if (role && !this.hasRole(role)) return false;

    // Multiple permissions check
    if (permissions.length > 0) {
      if (any) {
        // Any permission is sufficient
        if (!permissions.some(p => this.hasPermission(p))) return false;
      } else {
        // All permissions are required
        if (!permissions.every(p => this.hasPermission(p))) return false;
      }
    }

    // Multiple roles check
    if (roles.length > 0) {
      if (any) {
        // Any role is sufficient
        if (!roles.some(r => this.hasRole(r))) return false;
      } else {
        // All roles are required
        if (!roles.every(r => this.hasRole(r))) return false;
      }
    }

    return true;
  }

  /**
   * Check if a route is public (accessible without authentication)
   */
  static isPublicRoute(path: string): boolean {
    // Check for exact matches
    if (this.PUBLIC_ROUTES.includes(path)) return true;

    // Check for wildcard matches (e.g., /login/*)
    return this.PUBLIC_ROUTES.some(route => {
      if (route.endsWith('/*')) {
        const baseRoute = route.slice(0, -2); // Remove '/*'
        return path.startsWith(baseRoute);
      }
      return false;
    });
  }

  /**
   * Add a public route to the list of public routes
   * This is useful for plugins or modules that need to register their own public routes
   */
  static registerPublicRoute(route: string): void {
    if (!this.PUBLIC_ROUTES.includes(route)) {
      this.PUBLIC_ROUTES.push(route);
    }
  }

  /**
   * Clear token and permission state (used during logout)
   */
  static clearState(): void {
    locals.remove(ACCESS_TOKEN_KEY);
    this.refreshState();
  }
}

// Export PERMISSION_STATE_CHANGED for components to listen for changes
export { PERMISSION_STATE_CHANGED };
