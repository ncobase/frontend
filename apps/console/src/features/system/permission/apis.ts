import { Permission } from './permission';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  assignPermissionsToRole: async (roleId: string, permissionIds: string[]) => {
    return request.post(`/sys/roles/${roleId}/permissions`, { permissionIds });
  },

  removePermissionsFromRole: async (roleId: string, permissionIds: string[]) => {
    return request.delete(`/sys/roles/${roleId}/permissions`, { body: { permissionIds } });
  },

  getRolePermissions: async (roleId: string) => {
    return request.get(`/sys/roles/${roleId}/permissions`);
  },

  // Advanced permission queries
  getPermissionsByAction: async (action: string) => {
    return request.get(`${endpoint}?action=${action}`);
  },

  getPermissionsBySubject: async (subject: string) => {
    return request.get(`${endpoint}?subject=${subject}`);
  },

  getDefaultPermissions: async () => {
    return request.get(`${endpoint}?default=true`);
  },

  // Permission hierarchy
  getPermissionChildren: async (parentId: string) => {
    return request.get(`${endpoint}?parent=${parentId}`);
  },

  // Bulk operations
  bulkUpdatePermissions: async (updates: Array<{ id: string; [key: string]: any }>) => {
    return request.put(`${endpoint}/bulk`, { updates });
  },

  bulkDeletePermissions: async (ids: string[]) => {
    return request.delete(`${endpoint}/bulk`, { body: { ids } });
  }
});

export const permissionApi = createApi<Permission>('/sys/permissions', {
  extensions: extensionMethods
});

export const {
  create: createPermission,
  get: getPermission,
  update: updatePermission,
  delete: deletePermission,
  list: getPermissions,
  assignPermissionsToRole,
  removePermissionsFromRole,
  getRolePermissions,
  getPermissionsByAction,
  getPermissionsBySubject,
  getDefaultPermissions,
  getPermissionChildren,
  bulkUpdatePermissions,
  bulkDeletePermissions
} = permissionApi;
