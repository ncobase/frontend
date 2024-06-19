export interface Permission {
  id?: string;
  name?: string;
  action?: string;
  subject?: string;
  description?: string;
  default?: boolean;
  disabled?: true;
  extras?: object | null;
  parent?: string;
  group?: string;
  tenant?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface PermissionTree extends Permission {
  children?: Permission[];
}

export interface PermissionTrees {
  content: PermissionTree[];
}

export interface Permissions {
  content: Permission[];
  total: number;
}
