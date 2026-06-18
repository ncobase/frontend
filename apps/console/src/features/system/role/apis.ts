import { Role } from './role';

import { ApiContext, createApi } from '@/lib/api/factory';
import { assertRequiredApiArray, assertRequiredApiValue } from '@/lib/api/guards';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Role-Permission management
  getRolePermissions: async (roleId: string) => {
    return request.get(`${endpoint}/${assertRequiredApiValue(roleId, 'Role ID')}/permissions`);
  },

  assignPermissions: async (roleId: string, permissionIds: string[]) => {
    return request.post(`${endpoint}/${assertRequiredApiValue(roleId, 'Role ID')}/permissions`, {
      permissionIds: assertRequiredApiArray(permissionIds, 'Permission IDs')
    });
  },

  removePermissions: async (roleId: string, permissionIds: string[]) => {
    return request.delete(`${endpoint}/${assertRequiredApiValue(roleId, 'Role ID')}/permissions`, {
      body: { permissionIds: assertRequiredApiArray(permissionIds, 'Permission IDs') }
    });
  },

  // Role-User management
  getRoleUsers: async (roleId: string) => {
    return request.get(`${endpoint}/${assertRequiredApiValue(roleId, 'Role ID')}/users`);
  },

  assignUsers: async (roleId: string, userIds: string[]) => {
    return request.post(`${endpoint}/${assertRequiredApiValue(roleId, 'Role ID')}/users`, {
      userIds: assertRequiredApiArray(userIds, 'User IDs')
    });
  },

  removeUsers: async (roleId: string, userIds: string[]) => {
    return request.delete(`${endpoint}/${assertRequiredApiValue(roleId, 'Role ID')}/users`, {
      body: { userIds: assertRequiredApiArray(userIds, 'User IDs') }
    });
  },

  // Advanced queries
  getEnabledRoles: async () => {
    return request.get(`${endpoint}?disabled=false`);
  },

  getRoleBySlug: async (slug: string) => {
    return request.get(`${endpoint}/slug/${assertRequiredApiValue(slug, 'Role slug')}`);
  },

  // Role hierarchy
  getRoleChildren: async (parentId: string) => {
    return request.get(`${endpoint}?parent=${assertRequiredApiValue(parentId, 'Parent role ID')}`);
  },

  // Bulk operations
  bulkUpdateRoles: async (updates: Array<{ id: string; [key: string]: any }>) => {
    assertRequiredApiArray(updates, 'Role updates').forEach((update, index) => {
      assertRequiredApiValue(update.id, `Role updates[${index}].id`);
    });
    return request.put(`${endpoint}/bulk`, {
      updates
    });
  },

  bulkDeleteRoles: async (ids: string[]) => {
    return request.delete(`${endpoint}/bulk`, {
      body: { ids: assertRequiredApiArray(ids, 'Role IDs') }
    });
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
