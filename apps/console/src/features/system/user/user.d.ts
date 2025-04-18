import { Role } from '../role/role';
import { Tenant } from '../tenant/tenant';
/**
 * User entity - Core user information
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  is_certified: boolean;
  is_admin: boolean;
  tfa_enabled?: boolean;
  status: number; // 0: active, 1: inactive, 2: disabled
  extras?: Record<string, any>;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * User profile entity - Extended user information
 */
export interface UserProfile {
  id: string; // Same as user ID
  first_name?: string;
  last_name?: string;
  display_name?: string;
  short_bio?: string;
  about?: string;
  thumbnail?: string;
  language?: string;
  links?: UserSocialLink[];
  extras?: Record<string, any>;
}

/**
 * User social media link
 */
export interface UserSocialLink {
  name: string;
  url: string;
  type?: string;
}

/**
 * User combined with profile information - Used for comprehensive user data
 */
export interface UserMeshes {
  user: User;
  profile: UserProfile;
  roles?: Role[];
  tenants?: Tenant[];
}

/**
 * User list pagination parameters
 */
export interface UserListParams extends PaginationParams {
  status?: string | number;
  search?: string;
  role?: string;
  tenant_id?: string;
  is_admin?: boolean;
}

/**
 * API response for user list
 */
export interface UserListResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Add these to your PaginationParams if not already defined
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
  direction?: 'forward' | 'backward';
  sort?: string;
  order?: 'asc' | 'desc';
}
