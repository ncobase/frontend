import {
  Tenant,
  AddUserToTenantRoleRequest,
  BulkUpdateUserTenantRolesRequest,
  QuotaUsageRequest,
  PaymentRequest,
  BillingSummary,
  AddDictionaryToTenantRequest,
  AddGroupToTenantRequest,
  AddMenuToTenantRequest,
  AddOptionsToTenantRequest,
  TenantBillingBody,
  TenantQuotaBody
} from './tenant';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Basic CRUD operations
  getTenantBySlug: async (slug: string): Promise<Tenant> => {
    return request.get(`${endpoint}/${slug}`);
  },

  // Tenant Settings Management
  getTenantSettings: async (tenantId: string, params?: any) => {
    const searchParams = new URLSearchParams(params || {});
    const query = searchParams.toString();
    return request.get(`${endpoint}/${tenantId}/settings${query ? `?${query}` : ''}`);
  },

  getPublicSettings: async (tenantId: string) => {
    return request.get(`${endpoint}/${tenantId}/settings/public`);
  },

  setSetting: async (tenantId: string, key: string, value: string) => {
    return request.put(`${endpoint}/${tenantId}/settings/${key}`, { value });
  },

  getSetting: async (tenantId: string, key: string) => {
    return request.get(`${endpoint}/${tenantId}/settings/${key}`);
  },

  createSetting: async (payload: any) => {
    return request.post(`${endpoint}/settings`, payload);
  },

  updateSetting: async (id: string, payload: any) => {
    return request.put(`${endpoint}/settings/${id}`, payload);
  },

  deleteSetting: async (id: string) => {
    return request.delete(`${endpoint}/settings/${id}`);
  },

  bulkUpdateSettings: async (tenantId: string, settings: Record<string, string>) => {
    return request.post(`${endpoint}/settings/bulk`, { tenant_id: tenantId, settings });
  },

  // Tenant Quota Management
  getTenantQuotas: async (tenantId: string) => {
    return request.get(`${endpoint}/${tenantId}/quotas`);
  },

  getQuotaSummary: async (tenantId: string) => {
    return request.get(`${endpoint}/${tenantId}/quotas`);
  },

  createQuota: async (payload: TenantQuotaBody) => {
    return request.post(`${endpoint}/quotas`, payload);
  },

  updateQuota: async (id: string, payload: TenantQuotaBody) => {
    return request.put(`${endpoint}/quotas/${id}`, payload);
  },

  deleteQuota: async (id: string) => {
    return request.delete(`${endpoint}/quotas/${id}`);
  },

  updateUsage: async (payload: QuotaUsageRequest) => {
    return request.post(`${endpoint}/quotas/usage`, payload);
  },

  checkLimit: async (tenantId: string, quotaType: string) => {
    return request.get(`${endpoint}/quotas/check?tenant_id=${tenantId}&quota_type=${quotaType}`);
  },

  // Tenant Billing Management
  getTenantBilling: async (tenantId: string) => {
    return request.get(`${endpoint}/${tenantId}/billing/summary`);
  },

  getBillingSummary: async (tenantId: string): Promise<BillingSummary> => {
    return request.get(`${endpoint}/${tenantId}/billing/summary`);
  },

  getOverdueBilling: async (tenantId: string) => {
    return request.get(`${endpoint}/${tenantId}/billing/overdue`);
  },

  createBilling: async (payload: TenantBillingBody) => {
    return request.post(`${endpoint}/billing`, payload);
  },

  updateBilling: async (id: string, payload: TenantBillingBody) => {
    return request.put(`${endpoint}/billing/${id}`, payload);
  },

  deleteBilling: async (id: string) => {
    return request.delete(`${endpoint}/billing/${id}`);
  },

  processPayment: async (payload: PaymentRequest) => {
    return request.post(`${endpoint}/billing/payment`, payload);
  },

  generateInvoice: async (tenantId: string, billingId: string) => {
    return request.post(`${endpoint}/${tenantId}/billing/invoice`, { billing_id: billingId });
  },

  // User-Tenant-Role Management
  getTenantUsers: async (tenantId: string, params?: any) => {
    const searchParams = new URLSearchParams(params || {});
    const query = searchParams.toString();
    return request.get(`${endpoint}/${tenantId}/users${query ? `?${query}` : ''}`);
  },

  addUserToTenantRole: async (tenantId: string, payload: AddUserToTenantRoleRequest) => {
    return request.post(`${endpoint}/${tenantId}/users/roles`, payload);
  },

  getUserTenantRoles: async (tenantId: string, userId: string) => {
    return request.get(`${endpoint}/${tenantId}/users/${userId}/roles`);
  },

  updateUserTenantRole: async (tenantId: string, userId: string, payload: any) => {
    return request.put(`${endpoint}/${tenantId}/users/${userId}/roles`, payload);
  },

  removeUserFromTenantRole: async (tenantId: string, userId: string, roleId: string) => {
    return request.delete(`${endpoint}/${tenantId}/users/${userId}/roles/${roleId}`);
  },

  checkUserTenantRole: async (tenantId: string, userId: string, roleId: string) => {
    return request.get(`${endpoint}/${tenantId}/users/${userId}/roles/${roleId}/check`);
  },

  getTenantUsersByRole: async (tenantId: string, roleId: string) => {
    return request.get(`${endpoint}/${tenantId}/roles/${roleId}/users`);
  },

  bulkUpdateUserTenantRoles: async (
    tenantId: string,
    payload: BulkUpdateUserTenantRolesRequest
  ) => {
    return request.put(`${endpoint}/${tenantId}/users/roles/bulk`, payload);
  },

  // Tenant-Group Management
  getTenantGroups: async (tenantId: string, params?: any) => {
    const searchParams = new URLSearchParams(params || {});
    const query = searchParams.toString();
    return request.get(`${endpoint}/${tenantId}/groups${query ? `?${query}` : ''}`);
  },

  addGroupToTenant: async (tenantId: string, payload: AddGroupToTenantRequest) => {
    return request.post(`${endpoint}/${tenantId}/groups`, payload);
  },

  removeGroupFromTenant: async (tenantId: string, groupId: string) => {
    return request.delete(`${endpoint}/${tenantId}/groups/${groupId}`);
  },

  isGroupInTenant: async (tenantId: string, groupId: string) => {
    return request.get(`${endpoint}/${tenantId}/groups/${groupId}/check`);
  },

  getGroupTenants: async (groupId: string) => {
    return request.get(`${endpoint}/groups/${groupId}/tenants`);
  },

  // Tenant-Menu Management
  getTenantMenus: async (tenantId: string) => {
    return request.get(`${endpoint}/${tenantId}/menus`);
  },

  addMenuToTenant: async (tenantId: string, payload: AddMenuToTenantRequest) => {
    return request.post(`${endpoint}/${tenantId}/menus`, payload);
  },

  removeMenuFromTenant: async (tenantId: string, menuId: string) => {
    return request.delete(`${endpoint}/${tenantId}/menus/${menuId}`);
  },

  checkMenuInTenant: async (tenantId: string, menuId: string) => {
    return request.get(`${endpoint}/${tenantId}/menus/${menuId}/check`);
  },

  // Tenant-Dictionary Management
  getTenantDictionaries: async (tenantId: string) => {
    return request.get(`${endpoint}/${tenantId}/dictionaries`);
  },

  addDictionaryToTenant: async (tenantId: string, payload: AddDictionaryToTenantRequest) => {
    return request.post(`${endpoint}/${tenantId}/dictionaries`, payload);
  },

  removeDictionaryFromTenant: async (tenantId: string, dictionaryId: string) => {
    return request.delete(`${endpoint}/${tenantId}/dictionaries/${dictionaryId}`);
  },

  checkDictionaryInTenant: async (tenantId: string, dictionaryId: string) => {
    return request.get(`${endpoint}/${tenantId}/dictionaries/${dictionaryId}/check`);
  },

  // Tenant-Option Management
  getTenantOptions: async (tenantId: string) => {
    return request.get(`${endpoint}/${tenantId}/options`);
  },

  addOptionsToTenant: async (tenantId: string, payload: AddOptionsToTenantRequest) => {
    return request.post(`${endpoint}/${tenantId}/options`, payload);
  },

  removeOptionsFromTenant: async (tenantId: string, optionsId: string) => {
    return request.delete(`${endpoint}/${tenantId}/options/${optionsId}`);
  },

  checkOptionsInTenant: async (tenantId: string, optionsId: string) => {
    return request.get(`${endpoint}/${tenantId}/options/${optionsId}/check`);
  },

  // User's tenant ownership
  getUserOwnTenant: async (username: string) => {
    return request.get(`${endpoint}/users/${username}/tenant`);
  }
});

export const tenantApi = createApi<Tenant>('/sys/tenants', {
  extensions: extensionMethods
});

export const {
  // CRUD
  create: createTenant,
  get: getTenant,
  update: updateTenant,
  delete: deleteTenant,
  list: getTenants,
  getTenantBySlug,
  getTenantSettings,
  getPublicSettings,
  setSetting,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
  bulkUpdateSettings,

  // Quotas
  getTenantQuotas,
  getQuotaSummary,
  createQuota,
  updateQuota,
  deleteQuota,
  updateUsage,
  checkLimit,

  // Billing
  getTenantBilling,
  getBillingSummary,
  getOverdueBilling,
  createBilling,
  updateBilling,
  deleteBilling,
  processPayment,
  generateInvoice,

  // User-Tenant-Role
  getTenantUsers,
  addUserToTenantRole,
  getUserTenantRoles,
  updateUserTenantRole,
  removeUserFromTenantRole,
  checkUserTenantRole,
  getTenantUsersByRole,
  bulkUpdateUserTenantRoles,

  // Groups
  getTenantGroups,
  addGroupToTenant,
  removeGroupFromTenant,
  isGroupInTenant,
  getGroupTenants,

  // Menus
  getTenantMenus,
  addMenuToTenant,
  removeMenuFromTenant,
  checkMenuInTenant,

  // Dictionaries
  getTenantDictionaries,
  addDictionaryToTenant,
  removeDictionaryFromTenant,
  checkDictionaryInTenant,

  // Options
  getTenantOptions,
  addOptionsToTenant,
  removeOptionsFromTenant,
  checkOptionsInTenant,

  // User ownership
  getUserOwnTenant
} = tenantApi;
