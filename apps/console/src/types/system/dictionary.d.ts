export interface Dictionary {
  id?: string;
  name?: string;
  slug?: string;
  type?: string;
  value?: string;
  description?: string;
  tenant?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface Dictionaries {
  items: Dictionary[];
  total: number;
  has_next: boolean;
  next?: string;
}
