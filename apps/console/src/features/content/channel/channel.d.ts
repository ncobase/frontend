export interface Channel {
  id?: string;
  name?: string;
  type?:
    | 'website'
    | 'wechat'
    | 'douyin'
    | 'tiktok'
    | 'xiaohongshu'
    | 'twitter'
    | 'facebook'
    | 'custom';
  slug?: string;
  icon?: string;
  status?: number;
  allowed_types?: string[];
  config?: Record<string, any>;
  description?: string;
  logo?: string;
  webhook_url?: string;
  auto_publish?: boolean;
  require_review?: boolean;
  tenant_id?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}
