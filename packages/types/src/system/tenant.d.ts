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
  disabled?: boolean;
  expired_at?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface Tenants {
  content: Tenant[];
  total: number;
}
