// Tenant interfaces
export interface Tenant {
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

// Tenant Settings interfaces
export interface TenantSetting {
  id?: string;
  tenant_id: string;
  setting_key: string;
  setting_name: string;
  setting_value: string;
  default_value?: string;
  setting_type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  scope: 'system' | 'tenant' | 'user' | 'feature';
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

export interface TenantSettingBody {
  tenant_id: string;
  setting_key: string;
  setting_name: string;
  setting_value: string;
  default_value?: string;
  setting_type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  scope: 'system' | 'tenant' | 'user' | 'feature';
  category?: string;
  description?: string;
  is_public?: boolean;
  is_required?: boolean;
  is_readonly?: boolean;
  validation?: any;
}

// Tenant Quota interfaces
export interface TenantQuota {
  id?: string;
  tenant_id: string;
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

export interface TenantQuotaBody {
  tenant_id: string;
  quota_type: 'users' | 'storage' | 'api_calls' | 'projects' | 'custom';
  quota_name: string;
  max_value: number;
  current_used?: number;
  unit: 'count' | 'bytes' | 'mb' | 'gb' | 'tb';
  description?: string;
  enabled?: boolean;
}

export interface QuotaUsageRequest {
  tenant_id: string;
  quota_type: 'users' | 'storage' | 'api_calls' | 'projects' | 'custom';
  delta: number;
}

// Tenant Billing interfaces
export interface TenantBilling {
  id?: string;
  tenant_id: string;
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

export interface TenantBillingBody {
  tenant_id: string;
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
  tenant_id: string;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  currency: string;
  total_invoices: number;
  paid_invoices: number;
  overdue_invoices: number;
}

// User-Tenant-Role interfaces
export interface UserTenantRole {
  user_id: string;
  tenant_id: string;
  role_id: string;
}

export interface AddUserToTenantRoleRequest {
  user_id: string;
  role_id: string;
}

export interface BulkUpdateUserTenantRolesRequest {
  updates: UserTenantRoleUpdate[];
}

export interface UserTenantRoleUpdate {
  user_id: string;
  role_id: string;
  operation: 'add' | 'remove' | 'update';
  old_role_id?: string;
}

// Tenant Group interfaces
export interface TenantGroup {
  tenant_id: string;
  group_id: string;
}

export interface AddGroupToTenantRequest {
  group_id: string;
}

// Tenant Menu interfaces
export interface TenantMenu {
  tenant_id: string;
  menu_id: string;
}

export interface AddMenuToTenantRequest {
  menu_id: string;
}

// Tenant Dictionary interfaces
export interface TenantDictionary {
  tenant_id: string;
  dictionary_id: string;
}

export interface AddDictionaryToTenantRequest {
  dictionary_id: string;
}

// Tenant Option interfaces
export interface TenantOption {
  tenant_id: string;
  option_id: string;
}

export interface AddOptionsToTenantRequest {
  option_id: string;
}

export interface PaymentRequest {
  billing_id: string;
  payment_method: string;
  amount: number;
  transaction_id?: string;
}

export interface BillingSummary {
  tenant_id: string;
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
  tenant_id: string;
  quota_type: 'users' | 'storage' | 'api_calls' | 'projects' | 'custom';
  delta: number;
}

export interface AddUserToTenantRoleRequest {
  user_id: string;
  role_id: string;
}

export interface BulkUpdateUserTenantRolesRequest {
  updates: UserTenantRoleUpdate[];
}

export interface UserTenantRoleUpdate {
  user_id: string;
  role_id: string;
  operation: 'add' | 'remove' | 'update';
  old_role_id?: string;
}
