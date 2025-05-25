export interface Options {
  id?: string;
  name?: string;
  type?: string;
  value?: string;
  autoload?: boolean;
  tenant_id?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface OptionsList {
  items: Options[];
  total: number;
  has_next: boolean;
  next?: string;
}
