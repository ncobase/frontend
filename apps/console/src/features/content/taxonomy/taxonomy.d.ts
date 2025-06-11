export interface Taxonomy {
  id?: string;
  name?: string;
  type?: string;
  slug?: string;
  cover?: string;
  thumbnail?: string;
  color?: string;
  icon?: string;
  url?: string;
  keywords?: string;
  description?: string;
  status?: number;
  extras?: object | null;
  parent?: string;
  space_id?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export type QueryFormParams = {
  type?: string;
  code?: string;
  title?: string;
  status?: string;
} & PaginationParams;
