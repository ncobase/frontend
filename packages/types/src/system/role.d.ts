export interface Role {
  id?: string;
  name?: string;
  slug?: string;
  disabled?: boolean;
  description?: string;
  extras?: object | null;
  parent?: string;
  group?: string;
  tenant?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface Roles {
  content: Role[];
  total: number;
}
