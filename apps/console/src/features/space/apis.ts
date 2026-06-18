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
import { assertRequiredApiArray, assertRequiredApiValue } from '@/lib/api/guards';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Basic CRUD operations
  getSpaceBySlug: async (slug: string): Promise<Space> => {
    return request.get(`${endpoint}/${assertRequiredApiValue(slug, 'Space slug')}`);
  },

  // Space Settings Management
  getSpaceSettings: async (spaceId: string, params?: any) => {
    const searchParams = new URLSearchParams(params || {});
    const query = searchParams.toString();
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/settings${query ? `?${query}` : ''}`
    );
  },

  getPublicSettings: async (spaceId: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/settings/public`
    );
  },

  setSetting: async (spaceId: string, key: string, value: string) => {
    return request.put(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/settings/${assertRequiredApiValue(key, 'Setting key')}`,
      { value }
    );
  },

  getSetting: async (spaceId: string, key: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/settings/${assertRequiredApiValue(key, 'Setting key')}`
    );
  },

  createSetting: async (payload: any) => {
    return request.post(`${endpoint}/settings`, payload);
  },

  updateSetting: async (id: string, payload: any) => {
    return request.put(`${endpoint}/settings/${assertRequiredApiValue(id, 'Setting ID')}`, payload);
  },

  deleteSetting: async (id: string) => {
    return request.delete(`${endpoint}/settings/${assertRequiredApiValue(id, 'Setting ID')}`);
  },

  bulkUpdateSettings: async (spaceId: string, settings: Record<string, string>) => {
    return request.post(`${endpoint}/settings/bulk`, {
      space_id: assertRequiredApiValue(spaceId, 'Space ID'),
      settings
    });
  },

  // Space Quota Management
  getSpaceQuotas: async (spaceId: string) => {
    return request.get(`${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/quotas`);
  },

  getQuotaSummary: async (spaceId: string) => {
    return request.get(`${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/quotas`);
  },

  createQuota: async (payload: SpaceQuotaBody) => {
    return request.post(`${endpoint}/quotas`, payload);
  },

  updateQuota: async (id: string, payload: SpaceQuotaBody) => {
    return request.put(`${endpoint}/quotas/${assertRequiredApiValue(id, 'Quota ID')}`, payload);
  },

  deleteQuota: async (id: string) => {
    return request.delete(`${endpoint}/quotas/${assertRequiredApiValue(id, 'Quota ID')}`);
  },

  updateUsage: async (payload: QuotaUsageRequest) => {
    const body = assertRequiredApiValue(payload, 'Quota usage payload');
    return request.post(`${endpoint}/quotas/usage`, {
      ...body,
      space_id: assertRequiredApiValue(body.space_id, 'Space ID'),
      quota_type: assertRequiredApiValue(body.quota_type, 'Quota type')
    });
  },

  checkLimit: async (spaceId: string, quotaType: string) => {
    return request.get(
      `${endpoint}/quotas/check?space_id=${assertRequiredApiValue(spaceId, 'Space ID')}&quota_type=${assertRequiredApiValue(quotaType, 'Quota type')}`
    );
  },

  // Space Billing Management
  getSpaceBilling: async (spaceId: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/billing/summary`
    );
  },

  getBillingSummary: async (spaceId: string): Promise<BillingSummary> => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/billing/summary`
    );
  },

  getOverdueBilling: async (spaceId: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/billing/overdue`
    );
  },

  createBilling: async (payload: SpaceBillingBody) => {
    return request.post(`${endpoint}/billing`, payload);
  },

  updateBilling: async (id: string, payload: SpaceBillingBody) => {
    return request.put(`${endpoint}/billing/${assertRequiredApiValue(id, 'Billing ID')}`, payload);
  },

  deleteBilling: async (id: string) => {
    return request.delete(`${endpoint}/billing/${assertRequiredApiValue(id, 'Billing ID')}`);
  },

  processPayment: async (payload: PaymentRequest) => {
    const body = assertRequiredApiValue(payload, 'Payment payload');
    return request.post(`${endpoint}/billing/payment`, {
      ...body,
      billing_id: assertRequiredApiValue(body.billing_id, 'Billing ID'),
      payment_method: assertRequiredApiValue(body.payment_method, 'Payment method')
    });
  },

  generateInvoice: async (spaceId: string, billingId: string) => {
    return request.post(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/billing/invoice`,
      {
        billing_id: assertRequiredApiValue(billingId, 'Billing ID')
      }
    );
  },

  // User-Space-Role Management
  getSpaceUsers: async (spaceId: string, params?: any) => {
    const searchParams = new URLSearchParams(params || {});
    const query = searchParams.toString();
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/users${query ? `?${query}` : ''}`
    );
  },

  addUserToSpaceRole: async (spaceId: string, payload: AddUserToSpaceRoleRequest) => {
    const body = assertRequiredApiValue(payload, 'Space role payload');
    return request.post(`${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/users/roles`, {
      ...body,
      user_id: assertRequiredApiValue(body.user_id, 'User ID'),
      role_id: assertRequiredApiValue(body.role_id, 'Role ID')
    });
  },

  getUserSpaceRoles: async (spaceId: string, userId: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/users/${assertRequiredApiValue(userId, 'User ID')}/roles`
    );
  },

  updateUserSpaceRole: async (spaceId: string, userId: string, payload: any) => {
    return request.put(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/users/${assertRequiredApiValue(userId, 'User ID')}/roles`,
      payload
    );
  },

  removeUserFromSpaceRole: async (spaceId: string, userId: string, roleId: string) => {
    return request.delete(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/users/${assertRequiredApiValue(userId, 'User ID')}/roles/${assertRequiredApiValue(roleId, 'Role ID')}`
    );
  },

  checkUserSpaceRole: async (spaceId: string, userId: string, roleId: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/users/${assertRequiredApiValue(userId, 'User ID')}/roles/${assertRequiredApiValue(roleId, 'Role ID')}/check`
    );
  },

  getSpaceUsersByRole: async (spaceId: string, roleId: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/roles/${assertRequiredApiValue(roleId, 'Role ID')}/users`
    );
  },

  bulkUpdateUserSpaceRoles: async (spaceId: string, payload: BulkUpdateUserSpaceRolesRequest) => {
    const body = assertRequiredApiValue(payload, 'User space role payload');
    const updates = assertRequiredApiArray(body.updates, 'User space role updates').map(
      (update, index) => ({
        ...update,
        user_id: assertRequiredApiValue(
          update.user_id,
          `User space role updates[${index}].user_id`
        ),
        role_id: assertRequiredApiValue(
          update.role_id,
          `User space role updates[${index}].role_id`
        ),
        operation: assertRequiredApiValue(
          update.operation,
          `User space role updates[${index}].operation`
        ),
        old_role_id:
          update.operation === 'update'
            ? assertRequiredApiValue(
                update.old_role_id,
                `User space role updates[${index}].old_role_id`
              )
            : update.old_role_id
      })
    );
    return request.put(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/users/roles/bulk`,
      { ...body, updates }
    );
  },

  // Space-Group Management
  getSpaceGroups: async (spaceId: string, params?: any) => {
    const searchParams = new URLSearchParams(params || {});
    const query = searchParams.toString();
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/orgs${query ? `?${query}` : ''}`
    );
  },

  addGroupToSpace: async (spaceId: string, payload: AddGroupToSpaceRequest) => {
    const body = assertRequiredApiValue(payload, 'Space group payload');
    return request.post(`${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/orgs`, {
      ...body,
      group_id: assertRequiredApiValue(body.group_id, 'Group ID')
    });
  },

  removeGroupFromSpace: async (spaceId: string, groupId: string) => {
    return request.delete(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/orgs/${assertRequiredApiValue(groupId, 'Group ID')}`
    );
  },

  isGroupInSpace: async (spaceId: string, groupId: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/orgs/${assertRequiredApiValue(groupId, 'Group ID')}/check`
    );
  },

  getOrgSpaces: async (groupId: string) => {
    return request.get(`${endpoint}/orgs/${assertRequiredApiValue(groupId, 'Group ID')}/spaces`);
  },

  // Space-Menu Management
  getSpaceMenus: async (spaceId: string) => {
    return request.get(`${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/menus`);
  },

  addMenuToSpace: async (spaceId: string, payload: AddMenuToSpaceRequest) => {
    const body = assertRequiredApiValue(payload, 'Space menu payload');
    return request.post(`${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/menus`, {
      ...body,
      menu_id: assertRequiredApiValue(body.menu_id, 'Menu ID')
    });
  },

  removeMenuFromSpace: async (spaceId: string, menuId: string) => {
    return request.delete(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/menus/${assertRequiredApiValue(menuId, 'Menu ID')}`
    );
  },

  checkMenuInSpace: async (spaceId: string, menuId: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/menus/${assertRequiredApiValue(menuId, 'Menu ID')}/check`
    );
  },

  // Space-Dictionary Management
  getSpaceDictionaries: async (spaceId: string) => {
    return request.get(`${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/dictionaries`);
  },

  addDictionaryToSpace: async (spaceId: string, payload: AddDictionaryToSpaceRequest) => {
    const body = assertRequiredApiValue(payload, 'Space dictionary payload');
    return request.post(`${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/dictionaries`, {
      ...body,
      dictionary_id: assertRequiredApiValue(body.dictionary_id, 'Dictionary ID')
    });
  },

  removeDictionaryFromSpace: async (spaceId: string, dictionaryId: string) => {
    return request.delete(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/dictionaries/${assertRequiredApiValue(dictionaryId, 'Dictionary ID')}`
    );
  },

  checkDictionaryInSpace: async (spaceId: string, dictionaryId: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/dictionaries/${assertRequiredApiValue(dictionaryId, 'Dictionary ID')}/check`
    );
  },

  // Space-Option Management
  getSpaceOptions: async (spaceId: string) => {
    return request.get(`${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/options`);
  },

  addOptionsToSpace: async (spaceId: string, payload: AddOptionsToSpaceRequest) => {
    const body = assertRequiredApiValue(payload, 'Space option payload');
    return request.post(`${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/options`, {
      ...body,
      option_id: assertRequiredApiValue(body.option_id, 'Option ID')
    });
  },

  removeOptionsFromSpace: async (spaceId: string, optionsId: string) => {
    return request.delete(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/options/${assertRequiredApiValue(optionsId, 'Option ID')}`
    );
  },

  checkOptionsInSpace: async (spaceId: string, optionsId: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(spaceId, 'Space ID')}/options/${assertRequiredApiValue(optionsId, 'Option ID')}/check`
    );
  },

  // User's space ownership
  getUserOwnSpace: async (username: string) => {
    return request.get(`${endpoint}/users/${assertRequiredApiValue(username, 'Username')}/space`);
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
