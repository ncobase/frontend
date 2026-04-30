export interface Media {
  id?: string;
  title?: string;
  type?: 'image' | 'video' | 'audio' | 'file';
  url?: string;
  resource_id?: string;
  resource?: {
    id: string;
    name: string;
    path: string;
    type: string;
    size?: number;
    storage?: string;
    download_url?: string;
    thumbnail_url?: string;
    is_expired?: boolean;
  };
  path?: string;
  mime_type?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  description?: string;
  alt?: string;
  metadata?: Record<string, any>;
  space_id?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}
