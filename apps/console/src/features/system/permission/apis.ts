import { Permission } from './permission';

import { ApiContext, createApi } from '@/lib/api/factory';
import { assertRequiredApiArray, assertRequiredApiValue } from '@/lib/api/guards';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  assignPermissionsToRole: async (roleId: string, permissionIds: string[]) => {
    return request.post(`/sys/roles/${assertRequiredApiValue(roleId, 'Role ID')}/permissions`, {
      permissionIds: assertRequiredApiArray(permissionIds, 'Permission IDs')
    });
  },

  removePermissionsFromRole: async (roleId: string, permissionIds: string[]) => {
    return request.delete(`/sys/roles/${assertRequiredApiValue(roleId, 'Role ID')}/permissions`, {
      body: { permissionIds: assertRequiredApiArray(permissionIds, 'Permission IDs') }
    });
  },

  getRolePermissions: async (roleId: string) => {
    return request.get(`/sys/roles/${assertRequiredApiValue(roleId, 'Role ID')}/permissions`);
  },

  // Advanced permission queries
  getPermissionsByAction: async (action: string) => {
    return request.get(`${endpoint}?action=${assertRequiredApiValue(action, 'Action')}`);
  },

  getPermissionsBySubject: async (subject: string) => {
    return request.get(`${endpoint}?subject=${assertRequiredApiValue(subject, 'Subject')}`);
  },

  getDefaultPermissions: async () => {
    return request.get(`${endpoint}?default=true`);
  },

  // Permission hierarchy
  getPermissionChildren: async (parentId: string) => {
    return request.get(
      `${endpoint}?parent=${assertRequiredApiValue(parentId, 'Parent permission ID')}`
    );
  },

  // Bulk operations
  bulkUpdatePermissions: async (updates: Array<{ id: string; [key: string]: any }>) => {
    assertRequiredApiArray(updates, 'Permission updates').forEach((update, index) => {
      assertRequiredApiValue(update.id, `Permission updates[${index}].id`);
    });
    return request.put(`${endpoint}/bulk`, {
      updates
    });
  },

  bulkDeletePermissions: async (ids: string[]) => {
    return request.delete(`${endpoint}/bulk`, {
      body: { ids: assertRequiredApiArray(ids, 'Permission IDs') }
    });
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
