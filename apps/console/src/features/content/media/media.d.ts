export interface Media {
  id?: string;
  title?: string;
  type?: 'image' | 'video' | 'audio' | 'file';
  url?: string;
  path?: string;
  mime_type?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  description?: string;
  alt?: string;
  metadata?: Record<string, any>;
  tenant_id?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}
