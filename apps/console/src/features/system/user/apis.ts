import { User, UserMeshes } from './user';

import { createApi } from '@/lib/api/factory';

export interface CreateUserPayload {
  user: {
    username: string;
    email?: string;
    phone?: string;
    status?: number | string;
    password?: string;
  };
  profile: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    short_bio?: string;
    about?: string;
    language?: string;
    links?: any[];
  };
}

export interface UpdateUserPayload {
  user: {
    id: string;
    username?: string;
    email?: string;
    phone?: string;
    status?: number | string;
  };
  profile: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    short_bio?: string;
    about?: string;
    language?: string;
    links?: any[];
  };
}

export interface UserPasswordPayload {
  user_id: string;
  old_password?: string;
  new_password: string;
  confirm: string;
}

// Create enhanced API with extended methods
export const userApi = createApi<User, UserMeshes, UserMeshes, any>('/sys/users', {
  extensions: ({ endpoint, request }) => ({
    // Get user meshes (combined user and profile data)
    getUserMeshes: async (id: string): Promise<UserMeshes> => {
      console.log(111, id);

      return request.get(`${endpoint}/${id}/meshes`);
    },

    // Create a new user with profile
    createUserWithProfile: async (payload: CreateUserPayload): Promise<UserMeshes> => {
      return request.post(`${endpoint}`, payload);
    },

    // Update a user with profile
    updateUserWithProfile: async (payload: UpdateUserPayload): Promise<UserMeshes> => {
      return request.put(`${endpoint}/${payload.user.id}`, payload);
    },

    // Change user password
    changePassword: async (id: string, payload: UserPasswordPayload): Promise<void> => {
      return request.put(`${endpoint}/${id}/password`, payload);
    },

    // Get user roles
    getUserRoles: async (id: string): Promise<string[]> => {
      return request.get(`${endpoint}/${id}/roles`);
    },

    // Assign roles to user
    assignRoles: async (id: string, roleIds: string[]): Promise<void> => {
      return request.post(`${endpoint}/${id}/roles`, { roleIds });
    },

    // Remove roles from user
    removeRoles: async (id: string, roleIds: string[]): Promise<void> => {
      return request.delete(`${endpoint}/${id}/roles`, { body: { roleIds } });
    },

    // Enable user
    enableUser: async (id: string): Promise<UserMeshes> => {
      return request.put(`${endpoint}/${id}/enable`);
    },

    // Disable user
    disableUser: async (id: string): Promise<UserMeshes> => {
      return request.put(`${endpoint}/${id}/disable`);
    }
  })
});

export const createUser = userApi.create;
export const getUser = userApi.get;
export const updateUser = userApi.update;
export const deleteUser = userApi.delete;
export const getUsers = userApi.list;
export const getUserMeshes = userApi.getUserMeshes;
export const createUserWithProfile = userApi.createUserWithProfile;
export const updateUserWithProfile = userApi.updateUserWithProfile;
export const changePassword = userApi.changePassword;
export const getUserRoles = userApi.getUserRoles;
export const assignRoles = userApi.assignRoles;
export const removeRoles = userApi.removeRoles;
export const enableUser = userApi.enableUser;
export const disableUser = userApi.disableUser;
