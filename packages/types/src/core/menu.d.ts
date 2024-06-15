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
  children?: Menu[];
}

export interface MenuTree extends Menu {
  children?: Menu[];
}

export interface MenuTrees {
  content: MenuTree[];
}

export interface Menus {
  content: Menu[];
  total: number;
}
