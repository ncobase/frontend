// Space interfaces
export interface Space {
  id?: string;
  name?: string;
  slug?: string;
  type?: 'private' | 'public' | 'internal' | 'external' | 'other';
  title?: string;
  url?: string;
  logo?: string;
  logo_alt?: string;
  keywords?: string;
  copyright?: string;
  description?: string;
  order?: number;
  disabled?: boolean;
  extras?: object;
  expired_at?: number;
  created_by?: string;
  created_at?: number;
  updated_by?: string;
  updated_at?: number;
}

// Space Settings interfaces
export interface SpaceSetting {
  id?: string;
  space_id: string;
  setting_key: string;
  setting_name: string;
  setting_value: string;
  default_value?: string;
  setting_type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  scope: 'system' | 'space' | 'user' | 'feature';
  category?: string;
  description?: string;
  is_public: boolean;
  is_required: boolean;
  is_readonly: boolean;
  validation?: any;
  extras?: any;
  created_by?: string;
  created_at?: number;
  updated_by?: string;
  updated_at?: number;
}

export interface SpaceSettingBody {
  space_id: string;
  setting_key: string;
  setting_name: string;
  setting_value: string;
  default_value?: string;
  setting_type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  scope: 'system' | 'space' | 'user' | 'feature';
  category?: string;
  description?: string;
  is_public?: boolean;
  is_required?: boolean;
  is_readonly?: boolean;
  validation?: any;
}

// Space Quota interfaces
export interface SpaceQuota {
  id?: string;
  space_id: string;
  quota_type: 'users' | 'storage' | 'api_calls' | 'projects' | 'custom';
  quota_name: string;
  max_value: number;
  current_used: number;
  unit: 'count' | 'bytes' | 'mb' | 'gb' | 'tb';
  description?: string;
  enabled: boolean;
  utilization_percent: number;
  is_exceeded: boolean;
  extras?: any;
  created_by?: string;
  created_at?: number;
  updated_by?: string;
  updated_at?: number;
}

export interface SpaceQuotaBody {
  space_id: string;
  quota_type: 'users' | 'storage' | 'api_calls' | 'projects' | 'custom';
  quota_name: string;
  max_value: number;
  current_used?: number;
  unit: 'count' | 'bytes' | 'mb' | 'gb' | 'tb';
  description?: string;
  enabled?: boolean;
}

export interface QuotaUsageRequest {
  space_id: string;
  quota_type: 'users' | 'storage' | 'api_calls' | 'projects' | 'custom';
  delta: number;
}

// Space Billing interfaces
export interface SpaceBilling {
  id?: string;
  space_id: string;
  billing_period: 'monthly' | 'yearly' | 'one_time' | 'usage_based';
  period_start?: number;
  period_end?: number;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  description?: string;
  invoice_number?: string;
  payment_method?: string;
  paid_at?: number;
  due_date?: number;
  is_overdue: boolean;
  days_overdue: number;
  usage_details?: any;
  extras?: any;
  created_by?: string;
  created_at?: number;
  updated_by?: string;
  updated_at?: number;
}

export interface SpaceBillingBody {
  space_id: string;
  billing_period: 'monthly' | 'yearly' | 'one_time' | 'usage_based';
  period_start?: number;
  period_end?: number;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  description?: string;
  invoice_number?: string;
  payment_method?: string;
  due_date?: number;
  usage_details?: any;
}

export interface PaymentRequest {
  billing_id: string;
  payment_method: string;
  amount: number;
  transaction_id?: string;
}

export interface BillingSummary {
  space_id: string;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  currency: string;
  total_invoices: number;
  paid_invoices: number;
  overdue_invoices: number;
}

// User-Space-Role interfaces
export interface UserSpaceRole {
  user_id: string;
  space_id: string;
  role_id: string;
}

export interface AddUserToSpaceRoleRequest {
  user_id: string;
  role_id: string;
}

export interface BulkUpdateUserSpaceRolesRequest {
  updates: UserSpaceRoleUpdate[];
}

export interface UserSpaceRoleUpdate {
  user_id: string;
  role_id: string;
  operation: 'add' | 'remove' | 'update';
  old_role_id?: string;
}

// Space Group interfaces
export interface SpaceGroup {
  space_id: string;
  group_id: string;
}

export interface AddGroupToSpaceRequest {
  group_id: string;
}

// Space Menu interfaces
export interface SpaceMenu {
  space_id: string;
  menu_id: string;
}

export interface AddMenuToSpaceRequest {
  menu_id: string;
}

// Space Dictionary interfaces
export interface SpaceDictionary {
  space_id: string;
  dictionary_id: string;
}

export interface AddDictionaryToSpaceRequest {
  dictionary_id: string;
}

// Space Option interfaces
export interface SpaceOption {
  space_id: string;
  option_id: string;
}

export interface AddOptionsToSpaceRequest {
  option_id: string;
}

export interface PaymentRequest {
  billing_id: string;
  payment_method: string;
  amount: number;
  transaction_id?: string;
}

export interface BillingSummary {
  space_id: string;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  currency: string;
  total_invoices: number;
  paid_invoices: number;
  overdue_invoices: number;
}

export interface QuotaUsageRequest {
  space_id: string;
  quota_type: 'users' | 'storage' | 'api_calls' | 'projects' | 'custom';
  delta: number;
}

export interface AddUserToSpaceRoleRequest {
  user_id: string;
  role_id: string;
}

export interface BulkUpdateUserSpaceRolesRequest {
  updates: UserSpaceRoleUpdate[];
}

export interface UserSpaceRoleUpdate {
  user_id: string;
  role_id: string;
  operation: 'add' | 'remove' | 'update';
  old_role_id?: string;
}
