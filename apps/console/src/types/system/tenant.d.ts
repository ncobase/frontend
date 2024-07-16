export interface Tenant {
  id?: string;
  name?: string;
  type?: string;
  slug?: string;
  title?: string;
  url?: string;
  logo?: string;
  logo_alt?: string;
  keywords?: string;
  copyright?: string;
  description?: string;
  order?: number;
  disabled?: boolean;
  extras?: object;
  expired_at?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface Tenants {
  items: Tenant[];
  total: number;
  has_next: boolean;
  next?: string;
}
