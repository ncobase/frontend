export interface Role {
  id?: string;
  name?: string;
  slug?: string;
  disabled?: boolean;
  description?: string;
  extras?: object | null;
  created_by?: string;
  created_at?: number;
  updated_by?: number;
  updated_at?: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
}
