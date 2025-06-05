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
  created_at?: number;
  updated_at?: number;
}

export interface CreateUserPayload {
  user: {
    username: string;
    email?: string;
    phone?: string;
    status?: number | string;
    password?: string;
  };
  profile: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    short_bio?: string;
    about?: string;
    language?: string;
    links?: any[];
  };
}

export interface UpdateUserPayload {
  user: {
    id: string;
    username?: string;
    email?: string;
    phone?: string;
    status?: number | string;
  };
  profile: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    short_bio?: string;
    about?: string;
    language?: string;
    links?: any[];
  };
}

export interface UserPasswordPayload {
  user_id: string;
  old_password?: string;
  new_password: string;
  confirm: string;
}

/**
 * User profile entity - Extended user information
 */
export interface UserProfile {
  user_id: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  short_bio?: string;
  about?: string;
  thumbnail?: string;
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
 * User combined entity
 */
export interface UserMeshes {
  user: User;
  profile: UserProfile;
  employee?: Employee;
  api_keys?: ApiKey[];
  roles?: string[];
  tenants?: Tenant[];
  permissions?: string[];
  is_admin?: boolean;
  tenant_id?: string;
}

/**
 * User list pagination parameters
 */
export interface UserListParams {
  page?: number;
  limit?: number;
  cursor?: string;
  direction?: 'forward' | 'backward';
  sort?: string;
  order?: 'asc' | 'desc';
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

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
  direction?: 'forward' | 'backward';
  sort?: string;
  order?: 'asc' | 'desc';
}

// Employee interfaces
export interface Employee {
  user_id: string;
  tenant_id?: string;
  employee_id?: string;
  department?: string;
  position?: string;
  manager_id?: string;
  hire_date?: string;
  termination_date?: string;
  employment_type?: 'full_time' | 'part_time' | 'contract' | 'intern';
  status?: 'active' | 'inactive' | 'terminated' | 'on_leave';
  salary?: number;
  work_location?: 'office' | 'remote' | 'hybrid';
  contact_info?: any;
  skills?: string[];
  certifications?: string[];
  extras?: any;
  created_at?: number;
  updated_at?: number;
}

export interface EmployeeBody {
  user_id: string;
  tenant_id?: string;
  employee_id?: string;
  department?: string;
  position?: string;
  manager_id?: string;
  hire_date?: string;
  employment_type?: string;
  status?: string;
  salary?: number;
  work_location?: string;
  skills?: string[];
  certifications?: string[];
}

export interface EmployeeListParams extends PaginationParams {
  search?: string;
  department?: string;
  position?: string;
  manager_id?: string;
  hire_date?: string;
  termination_date?: string;
  employment_type?: string;
  status?: string;
  salary?: number;
  work_location?: string;
  skills?: string[];
  certifications?: string[];
  tenant_id?: string;
  is_admin?: boolean;
}

// API Key interfaces
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  user_id: string;
  created_at: number;
  last_used?: number;
}

export interface CreateApiKeyRequest {
  name: string;
}
