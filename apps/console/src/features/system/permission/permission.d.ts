export interface Permission {
  id?: string;
  name?: string;
  action?: string;
  subject?: string;
  description?: string;
  default?: boolean;
  disabled?: boolean;
  extras?: object | null;
  parent?: string;
  group?: string;
  space?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface Permissions {
  items: Permission[];
  total: number;
  has_next: boolean;
  next?: string;
}
