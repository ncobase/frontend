import type { Media } from '../media';

export interface TopicMedia {
  id?: string;
  topic_id?: string;
  media_id?: string;
  type?: 'featured' | 'gallery' | 'attachment';
  order?: number;
  media?: Media;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}
