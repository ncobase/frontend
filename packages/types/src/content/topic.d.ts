export interface Topic {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  content?: string;
  thumbnail?: string;
  temp?: true;
  markdown?: true;
  private?: true;
  status?: number;
  released?: string;
  taxonomy?: string;
  tenant?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface Topics {
  content: Topic[];
  total: number;
}
