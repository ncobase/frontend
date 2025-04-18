export interface Menu {
  id?: string;
  name?: string;
  label?: string;
  slug?: string;
  type?: string;
  path?: string;
  target?: string;
  icon?: string;
  perms?: string;
  hidden?: boolean;
  order?: number;
  disabled?: boolean;
  extras?: object | object[] | null;
  parent?: string;
  tenant?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface MenuTree extends Menu {
  children?: Menu[];
}

export interface MenuTrees {
  items: MenuTree[];
}

export interface Menus {
  items: Menu[];
  total: number;
  has_next: boolean;
  next?: string;
}
