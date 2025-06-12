export interface Org {
  id?: string;
  name?: string;
  slug?: string;
  type?: string;
  disabled?: boolean;
  description?: string;
  leader?: object | null;
  extras?: object | null;
  parent_id?: string;
  space_id?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}
