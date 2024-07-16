export interface User {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  status?: number;
  is_certified?: true;
  is_admin?: true;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface UserProfile {
  id?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  short_bio?: string;
  about?: string;
  thumbnail?: string;
  language?: string;
  links?: any[];
  extra?: object;
}

export interface UserMeshes {
  user: User;
  profile?: UserProfile;
  roles?: Role[];
  tenants?: Tenant[];
}

export interface Users {
  items: User[];
  total: number;
  has_next: boolean;
  next?: string;
}
