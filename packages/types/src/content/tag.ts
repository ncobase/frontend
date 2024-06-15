export interface Tag {
  id?: string;
  name?: string;
  topic?: string;
}

export interface Tags {
  content: Tag[];
  total: number;
}
