import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addDictionaryToTenant,
  addGroupToTenant,
  addMenuToTenant,
  addOptionsToTenant,
  addUserToTenantRole,
  bulkUpdateSettings,
  bulkUpdateUserTenantRoles,
  checkLimit,
  createBilling,
  createQuota,
  createSetting,
  createTenant,
  deleteBilling,
  deleteQuota,
  deleteSetting,
  deleteTenant,
  generateInvoice,
  getBillingSummary,
  getGroupTenants,
  getOverdueBilling,
  getPublicSettings,
  getQuotaSummary,
  getTenant,
  getTenantBilling,
  getTenantDictionaries,
  getTenantGroups,
  getTenantMenus,
  getTenantOptions,
  getTenantQuotas,
  getTenants,
  getTenantSettings,
  getTenantUsers,
  getTenantUsersByRole,
  getUserOwnTenant,
  getUserTenantRoles,
  processPayment,
  removeDictionaryFromTenant,
  removeGroupFromTenant,
  removeMenuFromTenant,
  removeOptionsFromTenant,
  removeUserFromTenantRole,
  setSetting,
  updateBilling,
  updateQuota,
  updateSetting,
  updateTenant,
  updateUsage,
  updateUserTenantRole
} from './apis';
import { QueryFormParams } from './config/query';
import {
  AddDictionaryToTenantRequest,
  AddGroupToTenantRequest,
  AddMenuToTenantRequest,
  AddOptionsToTenantRequest,
  AddUserToTenantRoleRequest,
  BulkUpdateUserTenantRolesRequest,
  QuotaUsageRequest,
  Tenant,
  TenantBillingBody,
  TenantQuotaBody,
  TenantSettingBody
} from './tenant';

export interface TenantQueryParams extends QueryFormParams {
  user?: string;
  name?: string;
  type?: string;
  disabled?: boolean | string;
  search?: string;
}

export interface TenantSettingsQueryParams {
  category?: string;
  scope?: string;
  is_public?: boolean;
  is_required?: boolean;
  cursor?: string;
  limit?: number;
  direction?: string;
}

export interface TenantQuotaQueryParams {
  tenant_id?: string;
  quota_type?: string;
  enabled?: boolean;
  cursor?: string;
  limit?: number;
  direction?: string;
}

export interface TenantBillingQueryParams {
  tenant_id?: string;
  status?: string;
  billing_period?: string;
  from_date?: number;
  to_date?: number;
  is_overdue?: boolean;
  cursor?: string;
  limit?: number;
  direction?: string;
}

export interface TenantUsersQueryParams {
  cursor?: string;
  limit?: number;
  direction?: string;
  role_id?: string;
  sort_by?: string;
}

export interface TenantGroupsQueryParams {
  cursor?: string;
  limit?: number;
  direction?: string;
  parent?: string;
  children?: boolean;
  sort_by?: string;
}

interface TenantKeys {
  create: ['tenantService', 'create'];
  update: ['tenantService', 'update'];
  delete: ['tenantService', 'delete'];
  list: (_params?: TenantQueryParams) => ['tenantService', 'tenants', TenantQueryParams];
  get: (_options?: { slug?: string }) => ['tenantService', 'tenant', { slug?: string }];
  // Settings keys
  settings: (_tenantId?: string) => ['tenantService', 'settings', { tenantId?: string }];
  setting: (
    _tenantId?: string,
    _key?: string
  ) => ['tenantService', 'setting', { tenantId?: string; key?: string }];
  publicSettings: (
    _tenantId?: string
  ) => ['tenantService', 'publicSettings', { tenantId?: string }];

  // Quota keys
  quotas: (_tenantId?: string) => ['tenantService', 'quotas', { tenantId?: string }];
  quota: (_id?: string) => ['tenantService', 'quota', { id?: string }];
  quotaSummary: (_tenantId?: string) => ['tenantService', 'quotaSummary', { tenantId?: string }];

  // Billing keys
  billing: (_tenantId?: string) => ['tenantService', 'billing', { tenantId?: string }];
  billingSummary: (
    _tenantId?: string
  ) => ['tenantService', 'billingSummary', { tenantId?: string }];
  overdueBilling: (
    _tenantId?: string
  ) => ['tenantService', 'overdueBilling', { tenantId?: string }];

  // User-Tenant-Role keys
  tenantUsers: (_tenantId?: string) => ['tenantService', 'tenantUsers', { tenantId?: string }];
  userTenantRoles: (
    _tenantId?: string,
    _userId?: string
  ) => ['tenantService', 'userTenantRoles', { tenantId?: string; userId?: string }];
  tenantUsersByRole: (
    _tenantId?: string,
    _roleId?: string
  ) => ['tenantService', 'tenantUsersByRole', { tenantId?: string; roleId?: string }];

  // Groups keys
  tenantGroups: (_tenantId?: string) => ['tenantService', 'tenantGroups', { tenantId?: string }];
  groupTenants: (_groupId?: string) => ['tenantService', 'groupTenants', { groupId?: string }];

  // Resource association keys
  tenantMenus: (_tenantId?: string) => ['tenantService', 'tenantMenus', { tenantId?: string }];
  tenantDictionaries: (
    _tenantId?: string
  ) => ['tenantService', 'tenantDictionaries', { tenantId?: string }];
  tenantOptions: (_tenantId?: string) => ['tenantService', 'tenantOptions', { tenantId?: string }];

  // User ownership
  userTenant: (_username?: string) => ['tenantService', 'userTenant', { username?: string }];
}

export const tenantKeys: TenantKeys = {
  create: ['tenantService', 'create'],
  get: ({ slug } = {}) => ['tenantService', 'tenant', { slug }],
  update: ['tenantService', 'update'],
  delete: ['tenantService', 'delete'],
  list: (params = {}) => ['tenantService', 'tenants', params],
  // Settings
  settings: tenantId => ['tenantService', 'settings', { tenantId }],
  setting: (tenantId, key) => ['tenantService', 'setting', { tenantId, key }],
  publicSettings: tenantId => ['tenantService', 'publicSettings', { tenantId }],

  // Quotas
  quotas: tenantId => ['tenantService', 'quotas', { tenantId }],
  quota: id => ['tenantService', 'quota', { id }],
  quotaSummary: tenantId => ['tenantService', 'quotaSummary', { tenantId }],

  // Billing
  billing: tenantId => ['tenantService', 'billing', { tenantId }],
  billingSummary: tenantId => ['tenantService', 'billingSummary', { tenantId }],
  overdueBilling: tenantId => ['tenantService', 'overdueBilling', { tenantId }],

  // User-Tenant-Role
  tenantUsers: tenantId => ['tenantService', 'tenantUsers', { tenantId }],
  userTenantRoles: (tenantId, userId) => ['tenantService', 'userTenantRoles', { tenantId, userId }],
  tenantUsersByRole: (tenantId, roleId) => [
    'tenantService',
    'tenantUsersByRole',
    { tenantId, roleId }
  ],

  // Groups
  tenantGroups: tenantId => ['tenantService', 'tenantGroups', { tenantId }],
  groupTenants: groupId => ['tenantService', 'groupTenants', { groupId }],

  // Resource associations
  tenantMenus: tenantId => ['tenantService', 'tenantMenus', { tenantId }],
  tenantDictionaries: tenantId => ['tenantService', 'tenantDictionaries', { tenantId }],
  tenantOptions: tenantId => ['tenantService', 'tenantOptions', { tenantId }],

  // User ownership
  userTenant: username => ['tenantService', 'userTenant', { username }]
};

// Query a specific tenant by slug
export const useQueryTenant = (slug: string) =>
  useQuery({
    queryKey: tenantKeys.get({ slug }),
    queryFn: () => getTenant(slug),
    enabled: !!slug
  });

// List tenants
export const useListTenants = (queryParams: TenantQueryParams) => {
  return useQuery({
    queryKey: tenantKeys.list(queryParams),
    queryFn: () => getTenants(queryParams),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

// Create tenant mutation
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Tenant) => createTenant(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'tenants'] });
    },
    onError: error => {
      console.error('Failed to create tenant:', error);
    }
  });
};

// Update tenant mutation
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Tenant) => {
      if (payload.expired_at) {
        payload.expired_at = new Date(payload.expired_at).getTime();
      }
      return updateTenant(payload);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'tenants'] });
      if (data?.slug) {
        queryClient.invalidateQueries({
          queryKey: tenantKeys.get({ slug: data.slug })
        });
      }
    },
    onError: error => {
      console.error('Failed to update tenant:', error);
    }
  });
};

// Delete tenant mutation
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteTenant(slug),
    onSuccess: (_, deletedSlug) => {
      queryClient.removeQueries({
        queryKey: tenantKeys.get({ slug: deletedSlug })
      });
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'tenants'] });
    },
    onError: error => {
      console.error('Failed to delete tenant:', error);
    }
  });
};

// =============================================================================
// TENANT SETTINGS
// =============================================================================

export const useQueryTenantSettings = (tenantId: string, params?: TenantSettingsQueryParams) => {
  return useQuery({
    queryKey: [...tenantKeys.settings(tenantId), params],
    queryFn: () => getTenantSettings(tenantId, params),
    enabled: !!tenantId
  });
};

export const useQueryPublicSettings = (tenantId: string) => {
  return useQuery({
    queryKey: tenantKeys.publicSettings(tenantId),
    queryFn: () => getPublicSettings(tenantId),
    enabled: !!tenantId,
    staleTime: 10 * 60 * 1000
  });
};

export const useCreateTenantSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TenantSettingBody) => createSetting(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tenantKeys.settings(variables.tenant_id)
      });
    },
    onError: error => {
      console.error('Failed to create tenant setting:', error);
    }
  });
};

export const useUpdateTenantSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & TenantSettingBody) =>
      updateSetting(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tenantKeys.settings(variables.tenant_id)
      });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.setting(variables.tenant_id, variables.setting_key)
      });
    },
    onError: error => {
      console.error('Failed to update tenant setting:', error);
    }
  });
};

export const useDeleteTenantSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSetting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'settings'] });
    },
    onError: error => {
      console.error('Failed to delete tenant setting:', error);
    }
  });
};

export const useSetTenantSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, key, value }: { tenantId: string; key: string; value: string }) =>
      setSetting(tenantId, key, value),
    onSuccess: (_, { tenantId, key }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.settings(tenantId) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.setting(tenantId, key) });
    },
    onError: error => {
      console.error('Failed to set tenant setting:', error);
    }
  });
};

export const useBulkUpdateTenantSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, settings }: { tenantId: string; settings: Record<string, string> }) =>
      bulkUpdateSettings(tenantId, settings),
    onSuccess: (_, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.settings(tenantId) });
    },
    onError: error => {
      console.error('Failed to bulk update tenant settings:', error);
    }
  });
};

// =============================================================================
// TENANT QUOTAS
// =============================================================================

export const useQueryTenantQuotas = (tenantId: string) => {
  return useQuery({
    queryKey: tenantKeys.quotas(tenantId),
    queryFn: () => getTenantQuotas(tenantId),
    enabled: !!tenantId
  });
};

export const useQueryQuotaSummary = (tenantId: string) => {
  return useQuery({
    queryKey: tenantKeys.quotaSummary(tenantId),
    queryFn: () => getQuotaSummary(tenantId),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000
  });
};

export const useCreateTenantQuota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TenantQuotaBody) => createQuota(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tenantKeys.quotas(variables.tenant_id)
      });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.quotaSummary(variables.tenant_id)
      });
    },
    onError: error => {
      console.error('Failed to create tenant quota:', error);
    }
  });
};

export const useUpdateTenantQuota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & TenantQuotaBody) => updateQuota(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tenantKeys.quotas(variables.tenant_id)
      });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.quotaSummary(variables.tenant_id)
      });
      queryClient.invalidateQueries({ queryKey: tenantKeys.quota(variables.id) });
    },
    onError: error => {
      console.error('Failed to update tenant quota:', error);
    }
  });
};

export const useDeleteTenantQuota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuota(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'quotas'] });
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'quotaSummary'] });
    },
    onError: error => {
      console.error('Failed to delete tenant quota:', error);
    }
  });
};

export const useUpdateQuotaUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuotaUsageRequest) => updateUsage(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tenantKeys.quotas(variables.tenant_id)
      });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.quotaSummary(variables.tenant_id)
      });
    },
    onError: error => {
      console.error('Failed to update quota usage:', error);
    }
  });
};

export const useCheckQuotaLimit = (tenantId: string, quotaType: string) => {
  return useQuery({
    queryKey: ['tenantService', 'quotaCheck', { tenantId, quotaType }],
    queryFn: () => checkLimit(tenantId, quotaType),
    enabled: !!(tenantId && quotaType),
    staleTime: 30 * 1000 // 30 seconds
  });
};

// =============================================================================
// TENANT BILLING
// =============================================================================

export const useQueryTenantBilling = (tenantId: string, params?: TenantBillingQueryParams) => {
  return useQuery({
    queryKey: [...tenantKeys.billing(tenantId), params],
    queryFn: () => getTenantBilling(tenantId),
    enabled: !!tenantId
  });
};

export const useQueryBillingSummary = (tenantId: string) => {
  return useQuery({
    queryKey: tenantKeys.billingSummary(tenantId),
    queryFn: () => getBillingSummary(tenantId),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000
  });
};

export const useQueryOverdueBilling = (tenantId: string) => {
  return useQuery({
    queryKey: tenantKeys.overdueBilling(tenantId),
    queryFn: () => getOverdueBilling(tenantId),
    enabled: !!tenantId,
    staleTime: 60 * 1000 // 1 minute
  });
};

export const useCreateTenantBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TenantBillingBody) => createBilling(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tenantKeys.billing(variables.tenant_id)
      });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.billingSummary(variables.tenant_id)
      });
    },
    onError: error => {
      console.error('Failed to create tenant billing:', error);
    }
  });
};

export const useUpdateTenantBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & TenantBillingBody) =>
      updateBilling(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tenantKeys.billing(variables.tenant_id)
      });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.billingSummary(variables.tenant_id)
      });
    },
    onError: error => {
      console.error('Failed to update tenant billing:', error);
    }
  });
};

export const useDeleteTenantBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBilling(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'billing'] });
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'billingSummary'] });
    },
    onError: error => {
      console.error('Failed to delete tenant billing:', error);
    }
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PaymentRequest) => processPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'billing'] });
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'billingSummary'] });
    },
    onError: error => {
      console.error('Failed to process payment:', error);
    }
  });
};

export const useGenerateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, billingId }: { tenantId: string; billingId: string }) =>
      generateInvoice(tenantId, billingId),
    onSuccess: (_, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.billing(tenantId) });
    },
    onError: error => {
      console.error('Failed to generate invoice:', error);
    }
  });
};

// =============================================================================
// USER-TENANT-ROLE MANAGEMENT
// =============================================================================

export const useQueryTenantUsers = (tenantId: string, params?: TenantUsersQueryParams) => {
  return useQuery({
    queryKey: [...tenantKeys.tenantUsers(tenantId), params],
    queryFn: () => getTenantUsers(tenantId, params),
    enabled: !!tenantId
  });
};

export const useQueryUserTenantRoles = (tenantId: string, userId: string) => {
  return useQuery({
    queryKey: tenantKeys.userTenantRoles(tenantId, userId),
    queryFn: () => getUserTenantRoles(tenantId, userId),
    enabled: !!(tenantId && userId)
  });
};

export const useQueryTenantUsersByRole = (tenantId: string, roleId: string) => {
  return useQuery({
    queryKey: tenantKeys.tenantUsersByRole(tenantId, roleId),
    queryFn: () => getTenantUsersByRole(tenantId, roleId),
    enabled: !!(tenantId && roleId)
  });
};

export const useAddUserToTenantRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, ...payload }: { tenantId: string } & AddUserToTenantRoleRequest) =>
      addUserToTenantRole(tenantId, payload),
    onSuccess: (_, { tenantId, user_id }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantUsers(tenantId) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.userTenantRoles(tenantId, user_id) });
    },
    onError: error => {
      console.error('Failed to add user to tenant role:', error);
    }
  });
};

export const useUpdateUserTenantRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, userId, ...payload }: { tenantId: string; userId: string } & any) =>
      updateUserTenantRole(tenantId, userId, payload),
    onSuccess: (_, { tenantId, userId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantUsers(tenantId) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.userTenantRoles(tenantId, userId) });
    },
    onError: error => {
      console.error('Failed to update user tenant role:', error);
    }
  });
};

export const useRemoveUserFromTenantRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tenantId,
      userId,
      roleId
    }: {
      tenantId: string;
      userId: string;
      roleId: string;
    }) => removeUserFromTenantRole(tenantId, userId, roleId),
    onSuccess: (_, { tenantId, userId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantUsers(tenantId) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.userTenantRoles(tenantId, userId) });
    },
    onError: error => {
      console.error('Failed to remove user from tenant role:', error);
    }
  });
};

export const useBulkUpdateUserTenantRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tenantId,
      ...payload
    }: { tenantId: string } & BulkUpdateUserTenantRolesRequest) =>
      bulkUpdateUserTenantRoles(tenantId, payload),
    onSuccess: (_, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantUsers(tenantId) });
      queryClient.invalidateQueries({ queryKey: ['tenantService', 'userTenantRoles'] });
    },
    onError: error => {
      console.error('Failed to bulk update user tenant roles:', error);
    }
  });
};

// =============================================================================
// TENANT-GROUP MANAGEMENT
// =============================================================================

export const useQueryTenantGroups = (tenantId: string, params?: TenantGroupsQueryParams) => {
  return useQuery({
    queryKey: [...tenantKeys.tenantGroups(tenantId), params],
    queryFn: () => getTenantGroups(tenantId, params),
    enabled: !!tenantId
  });
};

export const useQueryGroupTenants = (groupId: string) => {
  return useQuery({
    queryKey: tenantKeys.groupTenants(groupId),
    queryFn: () => getGroupTenants(groupId),
    enabled: !!groupId
  });
};

export const useAddGroupToTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, ...payload }: { tenantId: string } & AddGroupToTenantRequest) =>
      addGroupToTenant(tenantId, payload),
    onSuccess: (_, { tenantId, group_id }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantGroups(tenantId) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.groupTenants(group_id) });
    },
    onError: error => {
      console.error('Failed to add group to tenant:', error);
    }
  });
};

export const useRemoveGroupFromTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, groupId }: { tenantId: string; groupId: string }) =>
      removeGroupFromTenant(tenantId, groupId),
    onSuccess: (_, { tenantId, groupId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantGroups(tenantId) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.groupTenants(groupId) });
    },
    onError: error => {
      console.error('Failed to remove group from tenant:', error);
    }
  });
};

// =============================================================================
// TENANT RESOURCE ASSOCIATIONS
// =============================================================================

// Tenant Menus
export const useQueryTenantMenus = (tenantId: string) => {
  return useQuery({
    queryKey: tenantKeys.tenantMenus(tenantId),
    queryFn: () => getTenantMenus(tenantId),
    enabled: !!tenantId
  });
};

export const useAddMenuToTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, ...payload }: { tenantId: string } & AddMenuToTenantRequest) =>
      addMenuToTenant(tenantId, payload),
    onSuccess: (_, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantMenus(tenantId) });
    },
    onError: error => {
      console.error('Failed to add menu to tenant:', error);
    }
  });
};

export const useRemoveMenuFromTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, menuId }: { tenantId: string; menuId: string }) =>
      removeMenuFromTenant(tenantId, menuId),
    onSuccess: (_, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantMenus(tenantId) });
    },
    onError: error => {
      console.error('Failed to remove menu from tenant:', error);
    }
  });
};

// Tenant Dictionaries
export const useQueryTenantDictionaries = (tenantId: string) => {
  return useQuery({
    queryKey: tenantKeys.tenantDictionaries(tenantId),
    queryFn: () => getTenantDictionaries(tenantId),
    enabled: !!tenantId
  });
};

export const useAddDictionaryToTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, ...payload }: { tenantId: string } & AddDictionaryToTenantRequest) =>
      addDictionaryToTenant(tenantId, payload),
    onSuccess: (_, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantDictionaries(tenantId) });
    },
    onError: error => {
      console.error('Failed to add dictionary to tenant:', error);
    }
  });
};

export const useRemoveDictionaryFromTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, dictionaryId }: { tenantId: string; dictionaryId: string }) =>
      removeDictionaryFromTenant(tenantId, dictionaryId),
    onSuccess: (_, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantDictionaries(tenantId) });
    },
    onError: error => {
      console.error('Failed to remove dictionary from tenant:', error);
    }
  });
};

// Tenant Options
export const useQueryTenantOptions = (tenantId: string) => {
  return useQuery({
    queryKey: tenantKeys.tenantOptions(tenantId),
    queryFn: () => getTenantOptions(tenantId),
    enabled: !!tenantId
  });
};

export const useAddOptionsToTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, ...payload }: { tenantId: string } & AddOptionsToTenantRequest) =>
      addOptionsToTenant(tenantId, payload),
    onSuccess: (_, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantOptions(tenantId) });
    },
    onError: error => {
      console.error('Failed to add options to tenant:', error);
    }
  });
};

export const useRemoveOptionsFromTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, optionsId }: { tenantId: string; optionsId: string }) =>
      removeOptionsFromTenant(tenantId, optionsId),
    onSuccess: (_, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.tenantOptions(tenantId) });
    },
    onError: error => {
      console.error('Failed to remove options from tenant:', error);
    }
  });
};

// =============================================================================
// USER OWNERSHIP
// =============================================================================

export const useQueryUserOwnTenant = (username: string) => {
  return useQuery({
    queryKey: tenantKeys.userTenant(username),
    queryFn: () => getUserOwnTenant(username),
    enabled: !!username,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};
