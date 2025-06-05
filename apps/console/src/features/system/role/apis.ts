import { Role } from './role';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Role-Permission management
  getRolePermissions: async (roleId: string) => {
    return request.get(`${endpoint}/${roleId}/permissions`);
  },

  assignPermissions: async (roleId: string, permissionIds: string[]) => {
    return request.post(`${endpoint}/${roleId}/permissions`, { permissionIds });
  },

  removePermissions: async (roleId: string, permissionIds: string[]) => {
    return request.delete(`${endpoint}/${roleId}/permissions`, { body: { permissionIds } });
  },

  // Role-User management
  getRoleUsers: async (roleId: string) => {
    return request.get(`${endpoint}/${roleId}/users`);
  },

  assignUsers: async (roleId: string, userIds: string[]) => {
    return request.post(`${endpoint}/${roleId}/users`, { userIds });
  },

  removeUsers: async (roleId: string, userIds: string[]) => {
    return request.delete(`${endpoint}/${roleId}/users`, { body: { userIds } });
  },

  // Advanced queries
  getEnabledRoles: async () => {
    return request.get(`${endpoint}?disabled=false`);
  },

  getRoleBySlug: async (slug: string) => {
    return request.get(`${endpoint}/slug/${slug}`);
  },

  // Role hierarchy
  getRoleChildren: async (parentId: string) => {
    return request.get(`${endpoint}?parent=${parentId}`);
  },

  // Bulk operations
  bulkUpdateRoles: async (updates: Array<{ id: string; [key: string]: any }>) => {
    return request.put(`${endpoint}/bulk`, { updates });
  },

  bulkDeleteRoles: async (ids: string[]) => {
    return request.delete(`${endpoint}/bulk`, { body: { ids } });
  }
});

export const roleApi = createApi<Role>('/sys/roles', {
  extensions: extensionMethods
});

export const {
  create: createRole,
  get: getRole,
  update: updateRole,
  delete: deleteRole,
  list: getRoles,
  getRolePermissions,
  assignPermissions,
  removePermissions,
  getRoleUsers,
  assignUsers,
  removeUsers,
  getEnabledRoles,
  getRoleBySlug,
  getRoleChildren,
  bulkUpdateRoles,
  bulkDeleteRoles
} = roleApi;
