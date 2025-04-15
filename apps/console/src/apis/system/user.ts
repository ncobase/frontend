import { createApi } from '@/apis/factory';
import { User, UserMeshes, ExplicitAny } from '@/types';

export const userApi = createApi<User, UserMeshes, UserMeshes, ExplicitAny>('/sys/users', {
  extensions: ({ endpoint, request }) => ({
    // Get user meshes
    getUserMeshes: async (id: string): Promise<UserMeshes> => {
      return request.get(`${endpoint}/${id}/meshes`);
    }

    // Future extensibility examples:

    // Get user roles
    // getUserRoles: async (id: string): Promise<string[]> => {
    //   return request.get(`${endpoint}/${id}/roles`);
    // },

    // Assign roles to user
    // assignRoles: async (id: string, roleIds: string[]): Promise<void> => {
    //   return request.post(`${endpoint}/${id}/roles`, { roleIds });
    // },

    // Change user password
    // changePassword: async (id: string, oldPassword: string, newPassword: string): Promise<void> => {
    //   return request.put(`${endpoint}/${id}/password`, { oldPassword, newPassword });
    // }
  })
});

// For backwards compatibility, export individual functions
export const createUser = userApi.create;
export const getUser = userApi.get;
export const updateUser = userApi.update;
export const deleteUser = userApi.delete;
export const getUsers = userApi.list;
export const getUserMeshes = userApi.getUserMeshes;
