export interface Tag extends BaseModel {
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
