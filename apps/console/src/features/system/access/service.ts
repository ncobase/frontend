import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  ActivityListParams,
  ActivitySearchParams,
  CasbinRuleBody,
  CasbinRule,
  Activity
} from './access.d';
import {
  createCasbinRule,
  deleteCasbinRule,
  getCasbinRule,
  getCasbinRules,
  updateCasbinRule,
  bulkCreateCasbinRules,
  importPolicies,
  exportPolicies,
  validatePolicy,
  createActivity,
  deleteActivity,
  getActivity,
  getActivities,
  updateActivity,
  searchActivities,
  getUserActivities,
  getActivityAnalytics,
  bulkDeleteActivities,
  getActivityTypes
} from './apis';

// Query parameter types
export interface CasbinQueryParams {
  p_type?: string;
  v0?: string;
  v1?: string;
  v2?: string;
  v3?: string;
  cursor?: string;
  limit?: number;
  direction?: string;
}

// Query keys
interface CasbinKeys {
  list: (_params?: CasbinQueryParams) => ['casbinService', 'policies', CasbinQueryParams];
  get: (_id?: string) => ['casbinService', 'policy', { id?: string }];
  validate: ['casbinService', 'validate'];
  types: ['casbinService', 'types'];
}

interface ActivityKeys {
  list: (_params?: ActivityListParams) => ['activityService', 'activities', ActivityListParams];
  search: (_params?: ActivitySearchParams) => ['activityService', 'search', ActivitySearchParams];
  get: (_id?: string) => ['activityService', 'activity', { id?: string }];
  user: (_username?: string) => ['activityService', 'userActivities', { username?: string }];
  analytics: ['activityService', 'analytics'];
  types: ['activityService', 'types'];
}

export const casbinKeys: CasbinKeys = {
  list: (params = {}) => ['casbinService', 'policies', params],
  get: id => ['casbinService', 'policy', { id }],
  validate: ['casbinService', 'validate'],
  types: ['casbinService', 'types']
};

export const activityKeys: ActivityKeys = {
  list: (params = {}) => ['activityService', 'activities', params],
  search: (params = {}) => ['activityService', 'search', params],
  get: id => ['activityService', 'activity', { id }],
  user: username => ['activityService', 'userActivities', { username }],
  analytics: ['activityService', 'analytics'],
  types: ['activityService', 'types']
};

// =============================================================================
// CASBIN POLICY HOOKS
// =============================================================================

// List Casbin policies
export const useListCasbinPolicies = (params: CasbinQueryParams = {}) => {
  return useQuery({
    queryKey: casbinKeys.list(params),
    queryFn: () => getCasbinRules(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

// Get single Casbin policy
export const useQueryCasbinPolicy = (id: string) => {
  return useQuery({
    queryKey: casbinKeys.get(id),
    queryFn: () => getCasbinRule(id),
    enabled: !!id
  });
};

// Create Casbin policy
export const useCreateCasbinPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CasbinRuleBody) => createCasbinRule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casbinService', 'policies'] });
    },
    onError: error => {
      console.error('Failed to create Casbin policy:', error);
    }
  });
};

// Update Casbin policy
export const useUpdateCasbinPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CasbinRule) => updateCasbinRule(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['casbinService', 'policies'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: casbinKeys.get(variables.id)
        });
      }
    },
    onError: error => {
      console.error('Failed to update Casbin policy:', error);
    }
  });
};

// Delete Casbin policy
export const useDeleteCasbinPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCasbinRule(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: casbinKeys.get(deletedId)
      });
      queryClient.invalidateQueries({ queryKey: ['casbinService', 'policies'] });
    },
    onError: error => {
      console.error('Failed to delete Casbin policy:', error);
    }
  });
};

// Bulk create Casbin policies
export const useBulkCreateCasbinPolicies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (policies: CasbinRuleBody[]) => bulkCreateCasbinRules(policies),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casbinService', 'policies'] });
    },
    onError: error => {
      console.error('Failed to bulk create Casbin policies:', error);
    }
  });
};

// Validate Casbin policy
export const useValidateCasbinPolicy = () => {
  return useMutation({
    mutationFn: (policy: CasbinRuleBody) => validatePolicy(policy),
    onError: error => {
      console.error('Failed to validate Casbin policy:', error);
    }
  });
};

// Import Casbin policies
export const useImportCasbinPolicies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => importPolicies(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casbinService', 'policies'] });
    },
    onError: error => {
      console.error('Failed to import Casbin policies:', error);
    }
  });
};

// Export Casbin policies
export const useExportCasbinPolicies = () => {
  return useMutation({
    mutationFn: (format: 'json' | 'csv' = 'json') => exportPolicies(format),
    onError: error => {
      console.error('Failed to export Casbin policies:', error);
    }
  });
};

// =============================================================================
// ACTIVITY HOOKS
// =============================================================================

// List activities
export const useListActivities = (params: ActivityListParams = {}) => {
  return useQuery({
    queryKey: activityKeys.list(params),
    queryFn: () => getActivities(params),
    staleTime: 30 * 1000, // 30 seconds (activities change frequently)
    gcTime: 5 * 60 * 1000
  });
};

// Search activities
export const useSearchActivities = (params: ActivitySearchParams = {}) => {
  return useQuery({
    queryKey: activityKeys.search(params),
    queryFn: () => searchActivities(params),
    enabled: !!(params.q || params.user_id || params.type), // Only search when filters provided
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  });
};

// Get single activity
export const useQueryActivity = (id: string) => {
  return useQuery({
    queryKey: activityKeys.get(id),
    queryFn: () => getActivity(id),
    enabled: !!id
  });
};

// Get user activities
export const useQueryUserActivities = (username: string, params?: ActivityListParams) => {
  return useQuery({
    queryKey: [...activityKeys.user(username), params],
    queryFn: () => getUserActivities(username, params),
    enabled: !!username
  });
};

// Get activity analytics
export const useQueryActivityAnalytics = (params?: {
  from_date?: number;
  to_date?: number;
  group_by?: string;
}) => {
  return useQuery({
    queryKey: [...activityKeys.analytics, params],
    queryFn: () => getActivityAnalytics(params),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

// Get activity types
export const useQueryActivityTypes = () => {
  return useQuery({
    queryKey: activityKeys.types,
    queryFn: () => getActivityTypes(),
    staleTime: 60 * 60 * 1000 // 1 hour (types don't change often)
  });
};

// Create activity
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Activity, 'id'>) => createActivity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityService', 'activities'] });
      queryClient.invalidateQueries({ queryKey: ['activityService', 'search'] });
      queryClient.invalidateQueries({ queryKey: ['activityService', 'analytics'] });
    },
    onError: error => {
      console.error('Failed to create activity:', error);
    }
  });
};

// Update activity
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Activity) => updateActivity(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activityService', 'activities'] });
      queryClient.invalidateQueries({ queryKey: ['activityService', 'search'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: activityKeys.get(variables.id)
        });
      }
    },
    onError: error => {
      console.error('Failed to update activity:', error);
    }
  });
};

// Delete activity
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: activityKeys.get(deletedId)
      });
      queryClient.invalidateQueries({ queryKey: ['activityService', 'activities'] });
      queryClient.invalidateQueries({ queryKey: ['activityService', 'search'] });
    },
    onError: error => {
      console.error('Failed to delete activity:', error);
    }
  });
};

// Bulk delete activities
export const useBulkDeleteActivities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityIds: string[]) => bulkDeleteActivities(activityIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityService', 'activities'] });
      queryClient.invalidateQueries({ queryKey: ['activityService', 'search'] });
      queryClient.invalidateQueries({ queryKey: ['activityService', 'analytics'] });
    },
    onError: error => {
      console.error('Failed to bulk delete activities:', error);
    }
  });
};
