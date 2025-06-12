export interface Menu {
  id?: string;
  name: string;
  label: string;
  slug?: string;
  type: 'header' | 'sidebar' | 'account' | 'space';
  path?: string;
  target?: string;
  icon?: string;
  perms?: string;
  hidden?: boolean;
  order?: number;
  disabled?: boolean;
  extras?: any;
  parent_id?: string;
  children?: Menu[];
  created_by?: string;
  created_at?: number;
  updated_by?: string;
  updated_at?: number;
}

export interface MenuBody {
  name: string;
  label: string;
  slug?: string;
  type: 'header' | 'sidebar' | 'account' | 'space';
  path?: string;
  target?: string;
  icon?: string;
  perms?: string;
  hidden?: boolean;
  order?: number;
  disabled?: boolean;
  extras?: any;
  parent_id?: string;
}

export interface MenuTree extends Menu {
  children?: MenuTree[];
}

// Navigation menus
export interface NavigationMenus {
  headers: MenuTree[];
  sidebars: MenuTree[];
  accounts: MenuTree[];
  spaces: MenuTree[];
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
