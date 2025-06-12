import {
  User,
  UserMeshes,
  Employee,
  ApiKey,
  CreateApiKeyRequest,
  UserPasswordPayload,
  CreateUserPayload,
  UpdateUserPayload
} from './user';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // User meshes and profiles
  getUserMeshes: async (id: string): Promise<UserMeshes> => {
    return request.get(`${endpoint}/${id}/meshes`);
  },

  createUserWithProfile: async (payload: CreateUserPayload): Promise<UserMeshes> => {
    return request.post(`${endpoint}`, payload);
  },

  updateUserWithProfile: async (payload: UpdateUserPayload): Promise<UserMeshes> => {
    return request.put(`${endpoint}/${payload.user.id}/meshes`, payload);
  },

  // Password management
  changePassword: async (id: string, payload: UserPasswordPayload): Promise<void> => {
    return request.put(`${endpoint}/${id}/password`, payload);
  },

  resetPassword: async (payload: { username: string; email: string }): Promise<void> => {
    return request.post(`${endpoint}/reset-password`, payload);
  },

  // Role management
  getUserRoles: async (id: string): Promise<string[]> => {
    return request.get(`${endpoint}/${id}/roles`);
  },

  assignRoles: async (id: string, roleIds: string[]): Promise<void> => {
    return request.post(`${endpoint}/${id}/roles`, { roleIds });
  },

  removeRoles: async (id: string, roleIds: string[]): Promise<void> => {
    return request.delete(`${endpoint}/${id}/roles`, { body: { roleIds } });
  },

  // Status management
  enableUser: async (id: string): Promise<UserMeshes> => {
    return request.put(`${endpoint}/${id}/enable`);
  },

  disableUser: async (id: string): Promise<UserMeshes> => {
    return request.put(`${endpoint}/${id}/disable`);
  },

  updateStatus: async (username: string, status: number): Promise<User> => {
    return request.patch(`${endpoint}/${username}/status`, { status });
  },

  // Search and filter
  getFiltered: async (params: any): Promise<User[]> => {
    return request.get(`${endpoint}/filter`, { params });
  },

  getUserByEmail: async (email: string): Promise<User> => {
    return request.get(`${endpoint}/by-email/${email}`);
  },

  getUserByUsername: async (username: string): Promise<User> => {
    return request.get(`${endpoint}/by-username/${username}`);
  },

  // Profile management
  getUserProfile: async (username: string) => {
    return request.get(`${endpoint}/${username}/profile`);
  },

  updateUserProfile: async (username: string, payload: any) => {
    return request.put(`${endpoint}/${username}/profile`, payload);
  },

  // Employee management
  getEmployee: async (userId: string): Promise<Employee> => {
    return request.get(`${endpoint}/${userId}/employee`);
  },

  createEmployee: async (payload: any): Promise<Employee> => {
    return request.post(`${endpoint}/employees`, payload);
  },

  updateEmployee: async (userId: string, payload: any): Promise<Employee> => {
    return request.put(`${endpoint}/${userId}/employee`, payload);
  },

  deleteEmployee: async (userId: string): Promise<void> => {
    return request.delete(`${endpoint}/${userId}/employee`);
  },

  getEmployees: async (params: any): Promise<{ items: Employee[] }> => {
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    }
    return request.get(`${endpoint}/employees?${queryParams.toString()}`);
  },

  getEmployeesByDepartment: async (department: string): Promise<Employee[]> => {
    return request.get(`${endpoint}/employees/department/${department}`);
  },

  getEmployeesByManager: async (managerId: string): Promise<Employee[]> => {
    return request.get(`${endpoint}/employees/manager/${managerId}`);
  },

  // API Key management
  getUserApiKeys: async (userId: string): Promise<ApiKey[]> => {
    return request.get(`${endpoint}/${userId}/api-keys`);
  },

  getMyApiKeys: async (): Promise<ApiKey[]> => {
    return request.get(`${endpoint}/me/api-keys`);
  },

  generateApiKey: async (payload: CreateApiKeyRequest): Promise<ApiKey> => {
    return request.post(`${endpoint}/api-keys`, payload);
  },

  getApiKey: async (keyId: string): Promise<ApiKey> => {
    return request.get(`${endpoint}/api-keys/${keyId}`);
  },

  deleteApiKey: async (keyId: string): Promise<void> => {
    return request.delete(`${endpoint}/api-keys/${keyId}`);
  },

  // Space relationships
  getUserSpaceRoles: async (userId: string, spaceId: string) => {
    return request.get(`${endpoint}/${userId}/spaces/${spaceId}/roles`);
  }
});

export const userApi = createApi<User, UserMeshes, UserMeshes, any>('/sys/users', {
  extensions: extensionMethods
});

export const {
  create: createUser,
  get: getUser,
  update: updateUser,
  delete: deleteUser,
  list: getUsers,
  getUserMeshes,
  createUserWithProfile,
  updateUserWithProfile,
  changePassword,
  resetPassword,
  getUserRoles,
  assignRoles,
  removeRoles,
  enableUser,
  disableUser,
  updateStatus,
  getFiltered,
  getUserByEmail,
  getUserByUsername,
  getUserProfile,
  updateUserProfile,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeesByDepartment,
  getEmployeesByManager,
  getUserApiKeys,
  getMyApiKeys,
  generateApiKey,
  getApiKey,
  deleteApiKey,
  getUserSpaceRoles
} = userApi;
