export interface Tag {
  id?: string;
  name?: string;
  topic?: string;
}

export interface Tags {
  items: Tag[];
  total: number;
  has_next: boolean;
  next?: string;
}
