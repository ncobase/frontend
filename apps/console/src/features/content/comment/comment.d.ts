export interface Comment {
  id?: string;
  markdown?: boolean;
  approved?: boolean;
  content?: string;
  author?: object | null;
  reply_to?: string;
  related?: object | null;
  parent?: string;
  space_id?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface Comments {
  items: Comment[];
  total: number;
  has_next: boolean;
  next?: string;
}
