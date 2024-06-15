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

export interface DictionaryTree extends Dictionary {
  children?: Dictionary[];
}

export interface DictionaryTrees {
  content: DictionaryTree[];
}

export interface Dictionaries {
  content: Dictionary[];
  total: number;
}
