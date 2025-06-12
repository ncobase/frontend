import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addDictionaryToSpace,
  addGroupToSpace,
  addMenuToSpace,
  addOptionsToSpace,
  addUserToSpaceRole,
  bulkUpdateSettings,
  bulkUpdateUserSpaceRoles,
  checkLimit,
  createBilling,
  createQuota,
  createSetting,
  createSpace,
  deleteBilling,
  deleteQuota,
  deleteSetting,
  deleteSpace,
  generateInvoice,
  getBillingSummary,
  getOrgSpaces,
  getOverdueBilling,
  getPublicSettings,
  getQuotaSummary,
  getSpace,
  getSpaceBilling,
  getSpaceDictionaries,
  getSpaceGroups,
  getSpaceMenus,
  getSpaceOptions,
  getSpaceQuotas,
  getSpaces,
  getSpaceSettings,
  getSpaceUsers,
  getSpaceUsersByRole,
  getUserOwnSpace,
  getUserSpaceRoles,
  processPayment,
  removeDictionaryFromSpace,
  removeGroupFromSpace,
  removeMenuFromSpace,
  removeOptionsFromSpace,
  removeUserFromSpaceRole,
  setSetting,
  updateBilling,
  updateQuota,
  updateSetting,
  updateSpace,
  updateUsage,
  updateUserSpaceRole
} from './apis';
import { QueryFormParams } from './config/query';
import {
  AddDictionaryToSpaceRequest,
  AddGroupToSpaceRequest,
  AddMenuToSpaceRequest,
  AddOptionsToSpaceRequest,
  AddUserToSpaceRoleRequest,
  BulkUpdateUserSpaceRolesRequest,
  QuotaUsageRequest,
  Space,
  SpaceBillingBody,
  SpaceQuotaBody,
  SpaceSettingBody
} from './space';

export interface SpaceQueryParams extends QueryFormParams {
  user?: string;
  name?: string;
  type?: string;
  disabled?: boolean | string;
  search?: string;
}

export interface SpaceSettingsQueryParams {
  category?: string;
  scope?: string;
  is_public?: boolean;
  is_required?: boolean;
  cursor?: string;
  limit?: number;
  direction?: string;
}

export interface SpaceQuotaQueryParams {
  space_id?: string;
  quota_type?: string;
  enabled?: boolean;
  cursor?: string;
  limit?: number;
  direction?: string;
}

export interface SpaceBillingQueryParams {
  space_id?: string;
  status?: string;
  billing_period?: string;
  from_date?: number;
  to_date?: number;
  is_overdue?: boolean;
  cursor?: string;
  limit?: number;
  direction?: string;
}

export interface SpaceUsersQueryParams {
  cursor?: string;
  limit?: number;
  direction?: string;
  role_id?: string;
  sort_by?: string;
}

export interface SpaceGroupsQueryParams {
  cursor?: string;
  limit?: number;
  direction?: string;
  parent?: string;
  children?: boolean;
  sort_by?: string;
}

interface SpaceKeys {
  create: ['spaceService', 'create'];
  update: ['spaceService', 'update'];
  delete: ['spaceService', 'delete'];
  list: (_params?: SpaceQueryParams) => ['spaceService', 'spaces', SpaceQueryParams];
  get: (_options?: { slug?: string }) => ['spaceService', 'space', { slug?: string }];
  // Settings keys
  settings: (_spaceId?: string) => ['spaceService', 'settings', { spaceId?: string }];
  setting: (
    _spaceId?: string,
    _key?: string
  ) => ['spaceService', 'setting', { spaceId?: string; key?: string }];
  publicSettings: (_spaceId?: string) => ['spaceService', 'publicSettings', { spaceId?: string }];

  // Quota keys
  quotas: (_spaceId?: string) => ['spaceService', 'quotas', { spaceId?: string }];
  quota: (_id?: string) => ['spaceService', 'quota', { id?: string }];
  quotaSummary: (_spaceId?: string) => ['spaceService', 'quotaSummary', { spaceId?: string }];

  // Billing keys
  billing: (_spaceId?: string) => ['spaceService', 'billing', { spaceId?: string }];
  billingSummary: (_spaceId?: string) => ['spaceService', 'billingSummary', { spaceId?: string }];
  overdueBilling: (_spaceId?: string) => ['spaceService', 'overdueBilling', { spaceId?: string }];

  // User-Space-Role keys
  spaceUsers: (_spaceId?: string) => ['spaceService', 'spaceUsers', { spaceId?: string }];
  userSpaceRoles: (
    _spaceId?: string,
    _userId?: string
  ) => ['spaceService', 'userSpaceRoles', { spaceId?: string; userId?: string }];
  spaceUsersByRole: (
    _spaceId?: string,
    _roleId?: string
  ) => ['spaceService', 'spaceUsersByRole', { spaceId?: string; roleId?: string }];

  // Groups keys
  spaceGroups: (_spaceId?: string) => ['spaceService', 'spaceGroups', { spaceId?: string }];
  groupSpaces: (_groupId?: string) => ['spaceService', 'groupSpaces', { groupId?: string }];

  // Resource association keys
  spaceMenus: (_spaceId?: string) => ['spaceService', 'spaceMenus', { spaceId?: string }];
  spaceDictionaries: (
    _spaceId?: string
  ) => ['spaceService', 'spaceDictionaries', { spaceId?: string }];
  spaceOptions: (_spaceId?: string) => ['spaceService', 'spaceOptions', { spaceId?: string }];

  // User ownership
  userSpace: (_username?: string) => ['spaceService', 'userSpace', { username?: string }];
}

export const spaceKeys: SpaceKeys = {
  create: ['spaceService', 'create'],
  get: ({ slug } = {}) => ['spaceService', 'space', { slug }],
  update: ['spaceService', 'update'],
  delete: ['spaceService', 'delete'],
  list: (params = {}) => ['spaceService', 'spaces', params],
  // Settings
  settings: spaceId => ['spaceService', 'settings', { spaceId }],
  setting: (spaceId, key) => ['spaceService', 'setting', { spaceId, key }],
  publicSettings: spaceId => ['spaceService', 'publicSettings', { spaceId }],

  // Quotas
  quotas: spaceId => ['spaceService', 'quotas', { spaceId }],
  quota: id => ['spaceService', 'quota', { id }],
  quotaSummary: spaceId => ['spaceService', 'quotaSummary', { spaceId }],

  // Billing
  billing: spaceId => ['spaceService', 'billing', { spaceId }],
  billingSummary: spaceId => ['spaceService', 'billingSummary', { spaceId }],
  overdueBilling: spaceId => ['spaceService', 'overdueBilling', { spaceId }],

  // User-Space-Role
  spaceUsers: spaceId => ['spaceService', 'spaceUsers', { spaceId }],
  userSpaceRoles: (spaceId, userId) => ['spaceService', 'userSpaceRoles', { spaceId, userId }],
  spaceUsersByRole: (spaceId, roleId) => ['spaceService', 'spaceUsersByRole', { spaceId, roleId }],

  // Groups
  spaceGroups: spaceId => ['spaceService', 'spaceGroups', { spaceId }],
  groupSpaces: groupId => ['spaceService', 'groupSpaces', { groupId }],

  // Resource associations
  spaceMenus: spaceId => ['spaceService', 'spaceMenus', { spaceId }],
  spaceDictionaries: spaceId => ['spaceService', 'spaceDictionaries', { spaceId }],
  spaceOptions: spaceId => ['spaceService', 'spaceOptions', { spaceId }],

  // User ownership
  userSpace: username => ['spaceService', 'userSpace', { username }]
};

// Query a specific space by slug
export const useQuerySpace = (slug: string) =>
  useQuery({
    queryKey: spaceKeys.get({ slug }),
    queryFn: () => getSpace(slug),
    enabled: !!slug
  });

// List spaces
export const useListSpaces = (queryParams: SpaceQueryParams) => {
  return useQuery({
    queryKey: spaceKeys.list(queryParams),
    queryFn: () => getSpaces(queryParams),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

// Create space mutation
export const useCreateSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Space) => createSpace(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaceService', 'spaces'] });
    },
    onError: error => {
      console.error('Failed to create space:', error);
    }
  });
};

// Update space mutation
export const useUpdateSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Space) => {
      if (payload.expired_at) {
        payload.expired_at = new Date(payload.expired_at).getTime();
      }
      return updateSpace(payload);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['spaceService', 'spaces'] });
      if (data?.slug) {
        queryClient.invalidateQueries({
          queryKey: spaceKeys.get({ slug: data.slug })
        });
      }
    },
    onError: error => {
      console.error('Failed to update space:', error);
    }
  });
};

// Delete space mutation
export const useDeleteSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteSpace(slug),
    onSuccess: (_, deletedSlug) => {
      queryClient.removeQueries({
        queryKey: spaceKeys.get({ slug: deletedSlug })
      });
      queryClient.invalidateQueries({ queryKey: ['spaceService', 'spaces'] });
    },
    onError: error => {
      console.error('Failed to delete space:', error);
    }
  });
};

// =============================================================================
// TENANT SETTINGS
// =============================================================================

export const useQuerySpaceSettings = (spaceId: string, params?: SpaceSettingsQueryParams) => {
  return useQuery({
    queryKey: [...spaceKeys.settings(spaceId), params],
    queryFn: () => getSpaceSettings(spaceId, params),
    enabled: !!spaceId
  });
};

export const useQueryPublicSettings = (spaceId: string) => {
  return useQuery({
    queryKey: spaceKeys.publicSettings(spaceId),
    queryFn: () => getPublicSettings(spaceId),
    enabled: !!spaceId,
    staleTime: 10 * 60 * 1000
  });
};

export const useCreateSpaceSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SpaceSettingBody) => createSetting(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: spaceKeys.settings(variables.space_id)
      });
    },
    onError: error => {
      console.error('Failed to create space setting:', error);
    }
  });
};

export const useUpdateSpaceSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & SpaceSettingBody) =>
      updateSetting(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: spaceKeys.settings(variables.space_id)
      });
      queryClient.invalidateQueries({
        queryKey: spaceKeys.setting(variables.space_id, variables.setting_key)
      });
    },
    onError: error => {
      console.error('Failed to update space setting:', error);
    }
  });
};

export const useDeleteSpaceSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSetting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaceService', 'settings'] });
    },
    onError: error => {
      console.error('Failed to delete space setting:', error);
    }
  });
};

export const useSetSpaceSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, key, value }: { spaceId: string; key: string; value: string }) =>
      setSetting(spaceId, key, value),
    onSuccess: (_, { spaceId, key }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.settings(spaceId) });
      queryClient.invalidateQueries({ queryKey: spaceKeys.setting(spaceId, key) });
    },
    onError: error => {
      console.error('Failed to set space setting:', error);
    }
  });
};

export const useBulkUpdateSpaceSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, settings }: { spaceId: string; settings: Record<string, string> }) =>
      bulkUpdateSettings(spaceId, settings),
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.settings(spaceId) });
    },
    onError: error => {
      console.error('Failed to bulk update space settings:', error);
    }
  });
};

// =============================================================================
// TENANT QUOTAS
// =============================================================================

export const useQuerySpaceQuotas = (spaceId: string) => {
  return useQuery({
    queryKey: spaceKeys.quotas(spaceId),
    queryFn: () => getSpaceQuotas(spaceId),
    enabled: !!spaceId
  });
};

export const useQueryQuotaSummary = (spaceId: string) => {
  return useQuery({
    queryKey: spaceKeys.quotaSummary(spaceId),
    queryFn: () => getQuotaSummary(spaceId),
    enabled: !!spaceId,
    staleTime: 5 * 60 * 1000
  });
};

export const useCreateSpaceQuota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SpaceQuotaBody) => createQuota(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: spaceKeys.quotas(variables.space_id)
      });
      queryClient.invalidateQueries({
        queryKey: spaceKeys.quotaSummary(variables.space_id)
      });
    },
    onError: error => {
      console.error('Failed to create space quota:', error);
    }
  });
};

export const useUpdateSpaceQuota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & SpaceQuotaBody) => updateQuota(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: spaceKeys.quotas(variables.space_id)
      });
      queryClient.invalidateQueries({
        queryKey: spaceKeys.quotaSummary(variables.space_id)
      });
      queryClient.invalidateQueries({ queryKey: spaceKeys.quota(variables.id) });
    },
    onError: error => {
      console.error('Failed to update space quota:', error);
    }
  });
};

export const useDeleteSpaceQuota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuota(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaceService', 'quotas'] });
      queryClient.invalidateQueries({ queryKey: ['spaceService', 'quotaSummary'] });
    },
    onError: error => {
      console.error('Failed to delete space quota:', error);
    }
  });
};

export const useUpdateQuotaUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuotaUsageRequest) => updateUsage(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: spaceKeys.quotas(variables.space_id)
      });
      queryClient.invalidateQueries({
        queryKey: spaceKeys.quotaSummary(variables.space_id)
      });
    },
    onError: error => {
      console.error('Failed to update quota usage:', error);
    }
  });
};

export const useCheckQuotaLimit = (spaceId: string, quotaType: string) => {
  return useQuery({
    queryKey: ['spaceService', 'quotaCheck', { spaceId, quotaType }],
    queryFn: () => checkLimit(spaceId, quotaType),
    enabled: !!(spaceId && quotaType),
    staleTime: 30 * 1000 // 30 seconds
  });
};

// =============================================================================
// TENANT BILLING
// =============================================================================

export const useQuerySpaceBilling = (spaceId: string, params?: SpaceBillingQueryParams) => {
  return useQuery({
    queryKey: [...spaceKeys.billing(spaceId), params],
    queryFn: () => getSpaceBilling(spaceId),
    enabled: !!spaceId
  });
};

export const useQueryBillingSummary = (spaceId: string) => {
  return useQuery({
    queryKey: spaceKeys.billingSummary(spaceId),
    queryFn: () => getBillingSummary(spaceId),
    enabled: !!spaceId,
    staleTime: 5 * 60 * 1000
  });
};

export const useQueryOverdueBilling = (spaceId: string) => {
  return useQuery({
    queryKey: spaceKeys.overdueBilling(spaceId),
    queryFn: () => getOverdueBilling(spaceId),
    enabled: !!spaceId,
    staleTime: 60 * 1000 // 1 minute
  });
};

export const useCreateSpaceBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SpaceBillingBody) => createBilling(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: spaceKeys.billing(variables.space_id)
      });
      queryClient.invalidateQueries({
        queryKey: spaceKeys.billingSummary(variables.space_id)
      });
    },
    onError: error => {
      console.error('Failed to create space billing:', error);
    }
  });
};

export const useUpdateSpaceBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & SpaceBillingBody) =>
      updateBilling(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: spaceKeys.billing(variables.space_id)
      });
      queryClient.invalidateQueries({
        queryKey: spaceKeys.billingSummary(variables.space_id)
      });
    },
    onError: error => {
      console.error('Failed to update space billing:', error);
    }
  });
};

export const useDeleteSpaceBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBilling(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaceService', 'billing'] });
      queryClient.invalidateQueries({ queryKey: ['spaceService', 'billingSummary'] });
    },
    onError: error => {
      console.error('Failed to delete space billing:', error);
    }
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PaymentRequest) => processPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaceService', 'billing'] });
      queryClient.invalidateQueries({ queryKey: ['spaceService', 'billingSummary'] });
    },
    onError: error => {
      console.error('Failed to process payment:', error);
    }
  });
};

export const useGenerateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, billingId }: { spaceId: string; billingId: string }) =>
      generateInvoice(spaceId, billingId),
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.billing(spaceId) });
    },
    onError: error => {
      console.error('Failed to generate invoice:', error);
    }
  });
};

// =============================================================================
// USER-TENANT-ROLE MANAGEMENT
// =============================================================================

export const useQuerySpaceUsers = (spaceId: string, params?: SpaceUsersQueryParams) => {
  return useQuery({
    queryKey: [...spaceKeys.spaceUsers(spaceId), params],
    queryFn: () => getSpaceUsers(spaceId, params),
    enabled: !!spaceId
  });
};

export const useQueryUserSpaceRoles = (spaceId: string, userId: string) => {
  return useQuery({
    queryKey: spaceKeys.userSpaceRoles(spaceId, userId),
    queryFn: () => getUserSpaceRoles(spaceId, userId),
    enabled: !!(spaceId && userId)
  });
};

export const useQuerySpaceUsersByRole = (spaceId: string, roleId: string) => {
  return useQuery({
    queryKey: spaceKeys.spaceUsersByRole(spaceId, roleId),
    queryFn: () => getSpaceUsersByRole(spaceId, roleId),
    enabled: !!(spaceId && roleId)
  });
};

export const useAddUserToSpaceRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, ...payload }: { spaceId: string } & AddUserToSpaceRoleRequest) =>
      addUserToSpaceRole(spaceId, payload),
    onSuccess: (_, { spaceId, user_id }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceUsers(spaceId) });
      queryClient.invalidateQueries({ queryKey: spaceKeys.userSpaceRoles(spaceId, user_id) });
    },
    onError: error => {
      console.error('Failed to add user to space role:', error);
    }
  });
};

export const useUpdateUserSpaceRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, userId, ...payload }: { spaceId: string; userId: string } & any) =>
      updateUserSpaceRole(spaceId, userId, payload),
    onSuccess: (_, { spaceId, userId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceUsers(spaceId) });
      queryClient.invalidateQueries({ queryKey: spaceKeys.userSpaceRoles(spaceId, userId) });
    },
    onError: error => {
      console.error('Failed to update user space role:', error);
    }
  });
};

export const useRemoveUserFromSpaceRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      spaceId,
      userId,
      roleId
    }: {
      spaceId: string;
      userId: string;
      roleId: string;
    }) => removeUserFromSpaceRole(spaceId, userId, roleId),
    onSuccess: (_, { spaceId, userId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceUsers(spaceId) });
      queryClient.invalidateQueries({ queryKey: spaceKeys.userSpaceRoles(spaceId, userId) });
    },
    onError: error => {
      console.error('Failed to remove user from space role:', error);
    }
  });
};

export const useBulkUpdateUserSpaceRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, ...payload }: { spaceId: string } & BulkUpdateUserSpaceRolesRequest) =>
      bulkUpdateUserSpaceRoles(spaceId, payload),
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceUsers(spaceId) });
      queryClient.invalidateQueries({ queryKey: ['spaceService', 'userSpaceRoles'] });
    },
    onError: error => {
      console.error('Failed to bulk update user space roles:', error);
    }
  });
};

// =============================================================================
// TENANT-GROUP MANAGEMENT
// =============================================================================

export const useQuerySpaceGroups = (spaceId: string, params?: SpaceGroupsQueryParams) => {
  return useQuery({
    queryKey: [...spaceKeys.spaceGroups(spaceId), params],
    queryFn: () => getSpaceGroups(spaceId, params),
    enabled: !!spaceId
  });
};

export const useQueryOrgSpaces = (groupId: string) => {
  return useQuery({
    queryKey: spaceKeys.groupSpaces(groupId),
    queryFn: () => getOrgSpaces(groupId),
    enabled: !!groupId
  });
};

export const useAddGroupToSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, ...payload }: { spaceId: string } & AddGroupToSpaceRequest) =>
      addGroupToSpace(spaceId, payload),
    onSuccess: (_, { spaceId, group_id }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceGroups(spaceId) });
      queryClient.invalidateQueries({ queryKey: spaceKeys.groupSpaces(group_id) });
    },
    onError: error => {
      console.error('Failed to add group to space:', error);
    }
  });
};

export const useRemoveGroupFromSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, groupId }: { spaceId: string; groupId: string }) =>
      removeGroupFromSpace(spaceId, groupId),
    onSuccess: (_, { spaceId, groupId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceGroups(spaceId) });
      queryClient.invalidateQueries({ queryKey: spaceKeys.groupSpaces(groupId) });
    },
    onError: error => {
      console.error('Failed to remove group from space:', error);
    }
  });
};

// =============================================================================
// TENANT RESOURCE ASSOCIATIONS
// =============================================================================

// Space Menus
export const useQuerySpaceMenus = (spaceId: string) => {
  return useQuery({
    queryKey: spaceKeys.spaceMenus(spaceId),
    queryFn: () => getSpaceMenus(spaceId),
    enabled: !!spaceId
  });
};

export const useAddMenuToSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, ...payload }: { spaceId: string } & AddMenuToSpaceRequest) =>
      addMenuToSpace(spaceId, payload),
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceMenus(spaceId) });
    },
    onError: error => {
      console.error('Failed to add menu to space:', error);
    }
  });
};

export const useRemoveMenuFromSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, menuId }: { spaceId: string; menuId: string }) =>
      removeMenuFromSpace(spaceId, menuId),
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceMenus(spaceId) });
    },
    onError: error => {
      console.error('Failed to remove menu from space:', error);
    }
  });
};

// Space Dictionaries
export const useQuerySpaceDictionaries = (spaceId: string) => {
  return useQuery({
    queryKey: spaceKeys.spaceDictionaries(spaceId),
    queryFn: () => getSpaceDictionaries(spaceId),
    enabled: !!spaceId
  });
};

export const useAddDictionaryToSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, ...payload }: { spaceId: string } & AddDictionaryToSpaceRequest) =>
      addDictionaryToSpace(spaceId, payload),
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceDictionaries(spaceId) });
    },
    onError: error => {
      console.error('Failed to add dictionary to space:', error);
    }
  });
};

export const useRemoveDictionaryFromSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, dictionaryId }: { spaceId: string; dictionaryId: string }) =>
      removeDictionaryFromSpace(spaceId, dictionaryId),
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceDictionaries(spaceId) });
    },
    onError: error => {
      console.error('Failed to remove dictionary from space:', error);
    }
  });
};

// Space Options
export const useQuerySpaceOptions = (spaceId: string) => {
  return useQuery({
    queryKey: spaceKeys.spaceOptions(spaceId),
    queryFn: () => getSpaceOptions(spaceId),
    enabled: !!spaceId
  });
};

export const useAddOptionsToSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, ...payload }: { spaceId: string } & AddOptionsToSpaceRequest) =>
      addOptionsToSpace(spaceId, payload),
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceOptions(spaceId) });
    },
    onError: error => {
      console.error('Failed to add options to space:', error);
    }
  });
};

export const useRemoveOptionsFromSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, optionsId }: { spaceId: string; optionsId: string }) =>
      removeOptionsFromSpace(spaceId, optionsId),
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.spaceOptions(spaceId) });
    },
    onError: error => {
      console.error('Failed to remove options from space:', error);
    }
  });
};

// =============================================================================
// USER OWNERSHIP
// =============================================================================

export const useQueryUserOwnSpace = (username: string) => {
  return useQuery({
    queryKey: spaceKeys.userSpace(username),
    queryFn: () => getUserOwnSpace(username),
    enabled: !!username,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};
