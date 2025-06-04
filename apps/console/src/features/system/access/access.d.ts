export interface CasbinRule {
  id?: string;
  p_type: string;
  v0: string;
  v1: string;
  v2: string;
  v3?: string;
  v4?: string;
  v5?: string;
  created_by?: string;
  created_at?: number;
  updated_by?: string;
  updated_at?: number;
}

export interface CasbinRuleBody {
  p_type: string;
  v0: string;
  v1: string;
  v2: string;
  v3?: string;
  v4?: string;
  v5?: string;
  created_by?: string;
  updated_by?: string;
}

// Activity interfaces
export interface Activity {
  id: string;
  user_id: string;
  type: string;
  timestamp: number;
  details: string;
  metadata?: any;
  created_at?: number;
  updated_at?: number;
}

export interface CreateActivityRequest {
  type: string;
  details: string;
  metadata?: any;
}

export interface ActivitySearchParams {
  q?: string;
  user_id?: string;
  type?: string;
  from_date?: number;
  to_date?: number;
  from?: number;
  size?: number;
}

export interface ActivityListParams {
  cursor?: string;
  limit?: number;
  direction?: string;
  user_id?: string;
  type?: string;
  from_date?: number;
  to_date?: number;
  offset?: number;
  sort_by?: string;
  order?: string;
}
