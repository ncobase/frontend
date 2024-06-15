export interface Group {
  id?: string;
  name?: string;
  disabled?: boolean;
  description?: string;
  leader?: object | null;
  extras?: object | null;
  parent?: string;
  tenant?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface GroupTree extends Group {
  children?: Group[];
}

export interface GroupTrees {
  content: GroupTree[];
}

export interface Groups {
  content: Group[];
  total: number;
}
