import { Tenant, Tenants } from '../system/tenant/tenant';

import { Account, LoginProps, LoginReply, RegisterProps } from './account';

import { request } from '@/lib/api/request';

const accountEndpoint = '/iam/account';

export const accountApi = {
  // Current user
  getCurrentUser: async (): Promise<Account> => {
    return request.get(`${accountEndpoint}`);
  },

  // Get user owned tenant
  getAccountTenant: async (): Promise<Tenant> => {
    return request.get(`${accountEndpoint}/tenant`);
  },

  // Get user belonged tenants or related tenants
  getAccountTenants: async (): Promise<Tenants> => {
    return request.get(`${accountEndpoint}/tenants`);
  }

  /**
   * Extension examples
   */

  // Update current user profile
  // updateProfile: async (profile: Partial<Account>): Promise<Account> => {
  //   return request.put(`${accountEndpoint}/profile`, profile);
  // },

  // Change password for current user
  // changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
  //   return request.put(`${accountEndpoint}/password`, { oldPassword, newPassword });
  // },

  // Get user notifications
  // getNotifications: async (): Promise<Notification[]> => {
  //   return request.get(`${accountEndpoint}/notifications`);
  // }
};

const authEndpoint = '/iam';

export const authApi = {
  // Login
  login: async (payload: LoginProps): Promise<LoginReply> => {
    return request.post(`${authEndpoint}/login`, { ...payload });
  },

  // Register
  register: async (payload: RegisterProps): Promise<LoginReply> => {
    return request.post(`${authEndpoint}/register`, { ...payload });
  },

  // Logout
  logout: async (): Promise<void> => {
    return request.post(`${authEndpoint}/logout`);
  }

  /**
   * Extension examples
   */

  // Request password reset
  // requestPasswordReset: async (email: string): Promise<void> => {
  //   return request.post(`${authEndpoint}/request-password-reset`, { email });
  // },

  // Reset password with token
  // resetPassword: async (token: string, newPassword: string): Promise<void> => {
  //   return request.post(`${authEndpoint}/reset-password`, { token, newPassword });
  // },

  // Verify email address
  // verifyEmail: async (token: string): Promise<void> => {
  //   return request.post(`${authEndpoint}/verify-email`, { token });
  // }
};

export const getCurrentUser = accountApi.getCurrentUser;
export const getAccountTenant = accountApi.getAccountTenant;
export const getAccountTenants = accountApi.getAccountTenants;
export const loginAccount = authApi.login;
export const registerAccount = authApi.register;
export const logoutAccount = authApi.logout;
