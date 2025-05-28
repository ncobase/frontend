// Session interfaces
export interface Session {
  id: string;
  user_id: string;
  token_id: string;
  device_info?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  location?: string;
  login_method?: string;
  is_active: boolean;
  last_access_at?: number;
  expires_at?: number;
  created_at?: number;
  updated_at?: number;
}

export interface ListSessionsParams {
  cursor?: string;
  limit?: number;
  direction?: string;
  is_active?: boolean;
}
