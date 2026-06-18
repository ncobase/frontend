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
import { assertRequiredApiArray, assertRequiredApiValue } from '@/lib/api/guards';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // User meshes and profiles
  getUserMeshes: async (id: string): Promise<UserMeshes> => {
    return request.get(`${endpoint}/${assertRequiredApiValue(id, 'User ID')}/meshes`);
  },

  createUserWithProfile: async (payload: CreateUserPayload): Promise<UserMeshes> => {
    return request.post(`${endpoint}`, payload);
  },

  updateUserWithProfile: async (payload: UpdateUserPayload): Promise<UserMeshes> => {
    const user = assertRequiredApiValue(payload.user, 'User');
    return request.put(`${endpoint}/${assertRequiredApiValue(user.id, 'User ID')}/meshes`, payload);
  },

  // Password management
  changePassword: async (id: string, payload: UserPasswordPayload): Promise<void> => {
    return request.put(`${endpoint}/${assertRequiredApiValue(id, 'User ID')}/password`, payload);
  },

  resetPassword: async (payload: { username: string; email: string }): Promise<void> => {
    return request.post(`${endpoint}/reset-password`, payload);
  },

  // Role management
  getUserRoles: async (id: string): Promise<string[]> => {
    return request.get(`${endpoint}/${assertRequiredApiValue(id, 'User ID')}/roles`);
  },

  assignRoles: async (id: string, roleIds: string[]): Promise<void> => {
    return request.post(`${endpoint}/${assertRequiredApiValue(id, 'User ID')}/roles`, {
      roleIds: assertRequiredApiArray(roleIds, 'Role IDs')
    });
  },

  removeRoles: async (id: string, roleIds: string[]): Promise<void> => {
    return request.delete(`${endpoint}/${assertRequiredApiValue(id, 'User ID')}/roles`, {
      body: { roleIds: assertRequiredApiArray(roleIds, 'Role IDs') }
    });
  },

  // Status management
  enableUser: async (id: string): Promise<UserMeshes> => {
    return request.patch(`${endpoint}/${assertRequiredApiValue(id, 'User ID')}/status`, {
      status: 0
    });
  },

  disableUser: async (id: string): Promise<UserMeshes> => {
    return request.patch(`${endpoint}/${assertRequiredApiValue(id, 'User ID')}/status`, {
      status: 2
    });
  },

  updateStatus: async (username: string, status: number): Promise<User> => {
    return request.patch(`${endpoint}/${assertRequiredApiValue(username, 'Username')}/status`, {
      status
    });
  },

  // Search and filter
  getFiltered: async (params: any): Promise<User[]> => {
    return request.get(`${endpoint}/filter`, { params });
  },

  getUserByEmail: async (email: string): Promise<User> => {
    return request.get(`${endpoint}/by-email/${assertRequiredApiValue(email, 'Email')}`);
  },

  getUserByUsername: async (username: string): Promise<User> => {
    return request.get(`${endpoint}/by-username/${assertRequiredApiValue(username, 'Username')}`);
  },

  // Profile management
  getUserProfile: async (username: string) => {
    return request.get(`${endpoint}/${assertRequiredApiValue(username, 'Username')}/profile`);
  },

  updateUserProfile: async (username: string, payload: any) => {
    return request.put(
      `${endpoint}/${assertRequiredApiValue(username, 'Username')}/profile`,
      payload
    );
  },

  // Employee management
  getEmployee: async (userId: string): Promise<Employee> => {
    return request.get(`/sys/employees/${assertRequiredApiValue(userId, 'User ID')}`);
  },

  createEmployee: async (payload: any): Promise<Employee> => {
    return request.post('/sys/employees', payload);
  },

  updateEmployee: async (userId: string, payload: any): Promise<Employee> => {
    return request.put(`/sys/employees/${assertRequiredApiValue(userId, 'User ID')}`, payload);
  },

  deleteEmployee: async (userId: string): Promise<void> => {
    return request.delete(`/sys/employees/${assertRequiredApiValue(userId, 'User ID')}`);
  },

  getEmployees: async (params: any): Promise<{ items: Employee[] }> => {
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    }
    return request.get(`/sys/employees?${queryParams.toString()}`);
  },

  getEmployeesByDepartment: async (department: string): Promise<Employee[]> => {
    return request.get(
      `/sys/employees/department/${assertRequiredApiValue(department, 'Department')}`
    );
  },

  getEmployeesByManager: async (managerId: string): Promise<Employee[]> => {
    return request.get(`/sys/employees/manager/${assertRequiredApiValue(managerId, 'Manager ID')}`);
  },

  // API Key management
  getUserApiKeys: async (userId: string): Promise<ApiKey[]> => {
    return request.get(`${endpoint}/${assertRequiredApiValue(userId, 'User ID')}/api-keys`);
  },

  getMyApiKeys: async (): Promise<ApiKey[]> => {
    return request.get(`${endpoint}/me/api-keys`);
  },

  generateApiKey: async (payload: CreateApiKeyRequest): Promise<ApiKey> => {
    return request.post(`${endpoint}/api-keys`, payload);
  },

  getApiKey: async (keyId: string): Promise<ApiKey> => {
    return request.get(`${endpoint}/api-keys/${assertRequiredApiValue(keyId, 'API key ID')}`);
  },

  deleteApiKey: async (keyId: string): Promise<void> => {
    return request.delete(`${endpoint}/api-keys/${assertRequiredApiValue(keyId, 'API key ID')}`);
  },

  // Space relationships
  getUserSpaceRoles: async (userId: string, spaceId: string) => {
    return request.get(
      `${endpoint}/${assertRequiredApiValue(userId, 'User ID')}/spaces/${assertRequiredApiValue(spaceId, 'Space ID')}/roles`
    );
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
