import { Taxonomy } from '../taxonomy/taxonomy.d';

export interface Topic {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  content?: string;
  content_type?: string;
  thumbnail?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  excerpt_auto?: boolean;
  excerpt?: string;
  featured_media?: string;
  tags?: string[];
  temp?: true;
  markdown?: true;
  private?: true;
  status?: number;
  released?: string;
  taxonomy?: Taxonomy;
  taxonomy_id?: string;
  space_id?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export type QueryFormParams = {
  search?: string;
  title?: string;
  status?: string;
  taxonomy?: string;
  content_type?: string;
  private?: boolean | string;
  markdown?: boolean | string;
} & PaginationParams;
