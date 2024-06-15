export interface Application {
  id?: string;
  name?: string;
  slug?: string;
  type?: string;
  description?: string;
  icon?: string;
  url?: string;
  disabled?: boolean;
  system?: boolean;
  secret?: string;
  extras?: object | null;
  tenant?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface ApplicationTree extends Application {
  children?: Application[];
}

export interface ApplicationTrees {
  content: ApplicationTree[];
}

export interface Applications {
  content: Application[];
  total: number;
}
