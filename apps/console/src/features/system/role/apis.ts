import { Role } from './role';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  getRolePermissions: async (roleId: string) => {
    return request.get(`${endpoint}/${roleId}/permissions`);
  },

  getRoleUsers: async (roleId: string) => {
    return request.get(`${endpoint}/${roleId}/users`);
  },

  assignPermissionsToRole: async (roleId: string, permissionIds: string[]) => {
    return request.post(`${endpoint}/${roleId}/permissions`, {
      permissionIds
    });
  },

  removePermissionsFromRole: async (roleId: string, permissionIds: string[]) => {
    return request.delete(`${endpoint}/${roleId}/permissions`, {
      body: { permissionIds }
    });
  }
});

export const roleApi = createApi<Role>('/sys/roles', {
  extensions: extensionMethods
});

export const createRole = roleApi.create;
export const getRole = roleApi.get;
export const updateRole = roleApi.update;
export const deleteRole = roleApi.delete;
export const getRoles = roleApi.list;
export const getRolePermissions = roleApi.getRolePermissions;
export const getRoleUsers = roleApi.getRoleUsers;
export const assignPermissionsToRole = roleApi.assignPermissionsToRole;
export const removePermissionsFromRole = roleApi.removePermissionsFromRole;
