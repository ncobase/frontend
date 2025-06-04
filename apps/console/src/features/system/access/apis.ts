import {
  CasbinRuleBody,
  ActivitySearchParams,
  ActivityListParams,
  CasbinRule,
  Activity,
  CreateActivityRequest
} from './access.d';

import { ApiContext, createApi } from '@/lib/api/factory';

// Casbin API extensions
const casbinExtensions = ({ request, endpoint }: ApiContext) => ({
  // Get policy by rule components
  getPolicyByRule: async (ptype: string, rule: string[]) => {
    const params = new URLSearchParams({ p_type: ptype });
    rule.forEach((value, index) => {
      if (value) params.append(`v${index}`, value);
    });
    return request.get(`${endpoint}/by-rule?${params.toString()}`);
  },

  // Bulk create policies
  bulkCreate: async (policies: CasbinRuleBody[]) => {
    return request.post(`${endpoint}/bulk`, { policies });
  },

  // Import policies from file
  importPolicies: async (data: any) => {
    return request.post(`${endpoint}/import`, data);
  },

  // Export policies
  exportPolicies: async (format: 'json' | 'csv' = 'json') => {
    return request.get(`${endpoint}/export?format=${format}`);
  },

  // Validate policy
  validatePolicy: async (policy: CasbinRuleBody) => {
    return request.post(`${endpoint}/validate`, policy);
  }
});

// Activity API extensions
const activityExtensions = ({ request, endpoint }: ApiContext) => ({
  // Search activities
  searchActivities: async (params: ActivitySearchParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    return request.get(`${endpoint}/search?${searchParams.toString()}`);
  },

  // Get user activities
  getUserActivities: async (username: string, params?: ActivityListParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return request.get(`${endpoint}/users/${username}${query ? `?${query}` : ''}`);
  },

  // Get activity analytics
  getAnalytics: async (params?: { from_date?: number; to_date?: number; group_by?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return request.get(`${endpoint}/analytics${query ? `?${query}` : ''}`);
  },

  // Bulk delete activities
  bulkDelete: async (activityIds: string[]) => {
    return request.delete(`${endpoint}/bulk`, {
      body: { activity_ids: activityIds }
    });
  },

  // Get activity types
  getActivityTypes: async () => {
    return request.get(`${endpoint}/types`);
  }
});

// Create API instances
export const casbinApi = createApi<CasbinRule, CasbinRule, CasbinRuleBody, any>('/sys/policies', {
  extensions: casbinExtensions
});

export const activityApi = createApi<Activity, Activity, CreateActivityRequest, any>(
  '/sys/activities',
  {
    extensions: activityExtensions
  }
);

// Export individual methods for easier use
export const {
  create: createCasbinRule,
  get: getCasbinRule,
  update: updateCasbinRule,
  delete: deleteCasbinRule,
  list: getCasbinRules,
  getPolicyByRule,
  bulkCreate: bulkCreateCasbinRules,
  importPolicies,
  exportPolicies,
  validatePolicy
} = casbinApi;

export const {
  create: createActivity,
  get: getActivity,
  update: updateActivity,
  delete: deleteActivity,
  list: getActivities,
  searchActivities,
  getUserActivities,
  getAnalytics: getActivityAnalytics,
  bulkDelete: bulkDeleteActivities,
  getActivityTypes
} = activityApi;
