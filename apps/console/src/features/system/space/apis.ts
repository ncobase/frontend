import {
  Space,
  AddUserToSpaceRoleRequest,
  BulkUpdateUserSpaceRolesRequest,
  QuotaUsageRequest,
  PaymentRequest,
  BillingSummary,
  AddDictionaryToSpaceRequest,
  AddGroupToSpaceRequest,
  AddMenuToSpaceRequest,
  AddOptionsToSpaceRequest,
  SpaceBillingBody,
  SpaceQuotaBody
} from './space';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Basic CRUD operations
  getSpaceBySlug: async (slug: string): Promise<Space> => {
    return request.get(`${endpoint}/${slug}`);
  },

  // Space Settings Management
  getSpaceSettings: async (spaceId: string, params?: any) => {
    const searchParams = new URLSearchParams(params || {});
    const query = searchParams.toString();
    return request.get(`${endpoint}/${spaceId}/settings${query ? `?${query}` : ''}`);
  },

  getPublicSettings: async (spaceId: string) => {
    return request.get(`${endpoint}/${spaceId}/settings/public`);
  },

  setSetting: async (spaceId: string, key: string, value: string) => {
    return request.put(`${endpoint}/${spaceId}/settings/${key}`, { value });
  },

  getSetting: async (spaceId: string, key: string) => {
    return request.get(`${endpoint}/${spaceId}/settings/${key}`);
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

  bulkUpdateSettings: async (spaceId: string, settings: Record<string, string>) => {
    return request.post(`${endpoint}/settings/bulk`, { space_id: spaceId, settings });
  },

  // Space Quota Management
  getSpaceQuotas: async (spaceId: string) => {
    return request.get(`${endpoint}/${spaceId}/quotas`);
  },

  getQuotaSummary: async (spaceId: string) => {
    return request.get(`${endpoint}/${spaceId}/quotas`);
  },

  createQuota: async (payload: SpaceQuotaBody) => {
    return request.post(`${endpoint}/quotas`, payload);
  },

  updateQuota: async (id: string, payload: SpaceQuotaBody) => {
    return request.put(`${endpoint}/quotas/${id}`, payload);
  },

  deleteQuota: async (id: string) => {
    return request.delete(`${endpoint}/quotas/${id}`);
  },

  updateUsage: async (payload: QuotaUsageRequest) => {
    return request.post(`${endpoint}/quotas/usage`, payload);
  },

  checkLimit: async (spaceId: string, quotaType: string) => {
    return request.get(`${endpoint}/quotas/check?space_id=${spaceId}&quota_type=${quotaType}`);
  },

  // Space Billing Management
  getSpaceBilling: async (spaceId: string) => {
    return request.get(`${endpoint}/${spaceId}/billing/summary`);
  },

  getBillingSummary: async (spaceId: string): Promise<BillingSummary> => {
    return request.get(`${endpoint}/${spaceId}/billing/summary`);
  },

  getOverdueBilling: async (spaceId: string) => {
    return request.get(`${endpoint}/${spaceId}/billing/overdue`);
  },

  createBilling: async (payload: SpaceBillingBody) => {
    return request.post(`${endpoint}/billing`, payload);
  },

  updateBilling: async (id: string, payload: SpaceBillingBody) => {
    return request.put(`${endpoint}/billing/${id}`, payload);
  },

  deleteBilling: async (id: string) => {
    return request.delete(`${endpoint}/billing/${id}`);
  },

  processPayment: async (payload: PaymentRequest) => {
    return request.post(`${endpoint}/billing/payment`, payload);
  },

  generateInvoice: async (spaceId: string, billingId: string) => {
    return request.post(`${endpoint}/${spaceId}/billing/invoice`, { billing_id: billingId });
  },

  // User-Space-Role Management
  getSpaceUsers: async (spaceId: string, params?: any) => {
    const searchParams = new URLSearchParams(params || {});
    const query = searchParams.toString();
    return request.get(`${endpoint}/${spaceId}/users${query ? `?${query}` : ''}`);
  },

  addUserToSpaceRole: async (spaceId: string, payload: AddUserToSpaceRoleRequest) => {
    return request.post(`${endpoint}/${spaceId}/users/roles`, payload);
  },

  getUserSpaceRoles: async (spaceId: string, userId: string) => {
    return request.get(`${endpoint}/${spaceId}/users/${userId}/roles`);
  },

  updateUserSpaceRole: async (spaceId: string, userId: string, payload: any) => {
    return request.put(`${endpoint}/${spaceId}/users/${userId}/roles`, payload);
  },

  removeUserFromSpaceRole: async (spaceId: string, userId: string, roleId: string) => {
    return request.delete(`${endpoint}/${spaceId}/users/${userId}/roles/${roleId}`);
  },

  checkUserSpaceRole: async (spaceId: string, userId: string, roleId: string) => {
    return request.get(`${endpoint}/${spaceId}/users/${userId}/roles/${roleId}/check`);
  },

  getSpaceUsersByRole: async (spaceId: string, roleId: string) => {
    return request.get(`${endpoint}/${spaceId}/roles/${roleId}/users`);
  },

  bulkUpdateUserSpaceRoles: async (spaceId: string, payload: BulkUpdateUserSpaceRolesRequest) => {
    return request.put(`${endpoint}/${spaceId}/users/roles/bulk`, payload);
  },

  // Space-Group Management
  getSpaceGroups: async (spaceId: string, params?: any) => {
    const searchParams = new URLSearchParams(params || {});
    const query = searchParams.toString();
    return request.get(`${endpoint}/${spaceId}/orgs${query ? `?${query}` : ''}`);
  },

  addGroupToSpace: async (spaceId: string, payload: AddGroupToSpaceRequest) => {
    return request.post(`${endpoint}/${spaceId}/orgs`, payload);
  },

  removeGroupFromSpace: async (spaceId: string, groupId: string) => {
    return request.delete(`${endpoint}/${spaceId}/orgs/${groupId}`);
  },

  isGroupInSpace: async (spaceId: string, groupId: string) => {
    return request.get(`${endpoint}/${spaceId}/orgs/${groupId}/check`);
  },

  getOrgSpaces: async (groupId: string) => {
    return request.get(`${endpoint}/orgs/${groupId}/spaces`);
  },

  // Space-Menu Management
  getSpaceMenus: async (spaceId: string) => {
    return request.get(`${endpoint}/${spaceId}/menus`);
  },

  addMenuToSpace: async (spaceId: string, payload: AddMenuToSpaceRequest) => {
    return request.post(`${endpoint}/${spaceId}/menus`, payload);
  },

  removeMenuFromSpace: async (spaceId: string, menuId: string) => {
    return request.delete(`${endpoint}/${spaceId}/menus/${menuId}`);
  },

  checkMenuInSpace: async (spaceId: string, menuId: string) => {
    return request.get(`${endpoint}/${spaceId}/menus/${menuId}/check`);
  },

  // Space-Dictionary Management
  getSpaceDictionaries: async (spaceId: string) => {
    return request.get(`${endpoint}/${spaceId}/dictionaries`);
  },

  addDictionaryToSpace: async (spaceId: string, payload: AddDictionaryToSpaceRequest) => {
    return request.post(`${endpoint}/${spaceId}/dictionaries`, payload);
  },

  removeDictionaryFromSpace: async (spaceId: string, dictionaryId: string) => {
    return request.delete(`${endpoint}/${spaceId}/dictionaries/${dictionaryId}`);
  },

  checkDictionaryInSpace: async (spaceId: string, dictionaryId: string) => {
    return request.get(`${endpoint}/${spaceId}/dictionaries/${dictionaryId}/check`);
  },

  // Space-Option Management
  getSpaceOptions: async (spaceId: string) => {
    return request.get(`${endpoint}/${spaceId}/options`);
  },

  addOptionsToSpace: async (spaceId: string, payload: AddOptionsToSpaceRequest) => {
    return request.post(`${endpoint}/${spaceId}/options`, payload);
  },

  removeOptionsFromSpace: async (spaceId: string, optionsId: string) => {
    return request.delete(`${endpoint}/${spaceId}/options/${optionsId}`);
  },

  checkOptionsInSpace: async (spaceId: string, optionsId: string) => {
    return request.get(`${endpoint}/${spaceId}/options/${optionsId}/check`);
  },

  // User's space ownership
  getUserOwnSpace: async (username: string) => {
    return request.get(`${endpoint}/users/${username}/space`);
  }
});

export const spaceApi = createApi<Space>('/sys/spaces', {
  extensions: extensionMethods
});

export const {
  // CRUD
  create: createSpace,
  get: getSpace,
  update: updateSpace,
  delete: deleteSpace,
  list: getSpaces,
  getSpaceBySlug,
  getSpaceSettings,
  getPublicSettings,
  setSetting,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
  bulkUpdateSettings,

  // Quotas
  getSpaceQuotas,
  getQuotaSummary,
  createQuota,
  updateQuota,
  deleteQuota,
  updateUsage,
  checkLimit,

  // Billing
  getSpaceBilling,
  getBillingSummary,
  getOverdueBilling,
  createBilling,
  updateBilling,
  deleteBilling,
  processPayment,
  generateInvoice,

  // User-Space-Role
  getSpaceUsers,
  addUserToSpaceRole,
  getUserSpaceRoles,
  updateUserSpaceRole,
  removeUserFromSpaceRole,
  checkUserSpaceRole,
  getSpaceUsersByRole,
  bulkUpdateUserSpaceRoles,

  // Groups
  getSpaceGroups,
  addGroupToSpace,
  removeGroupFromSpace,
  isGroupInSpace,
  getOrgSpaces,

  // Menus
  getSpaceMenus,
  addMenuToSpace,
  removeMenuFromSpace,
  checkMenuInSpace,

  // Dictionaries
  getSpaceDictionaries,
  addDictionaryToSpace,
  removeDictionaryFromSpace,
  checkDictionaryInSpace,

  // Options
  getSpaceOptions,
  addOptionsToSpace,
  removeOptionsFromSpace,
  checkOptionsInSpace,

  // User ownership
  getUserOwnSpace
} = spaceApi;
