export interface Dictionary {
  id?: string;
  name: string;
  slug: string;
  type: string;
  value: string;
  description?: string;
  created_by?: string;
  created_at?: number;
  updated_by?: string;
  updated_at?: number;
}

export interface DictionaryBody {
  name: string;
  slug: string;
  type: string;
  value: string;
  description?: string;
}

export interface DictionaryUsage {
  module: string;
  location: string;
  count: number;
  reference_id?: string;
}
