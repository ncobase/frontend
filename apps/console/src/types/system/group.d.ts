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

export interface Groups {
  items: Group[];
  total: number;
  has_next: boolean;
  next?: string;
}
