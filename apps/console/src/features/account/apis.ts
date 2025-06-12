import { Space, Spaces } from '../system/space/space';

import { Account, LoginProps, LoginReply, RegisterProps } from './account';

import { request } from '@/lib/api/request';

const accountEndpoint = '/account';

export const accountApi = {
  // Current user
  getCurrentUser: async (): Promise<Account> => {
    return request.get(`${accountEndpoint}`);
  },

  // Get user owned space
  getAccountSpace: async (): Promise<Space> => {
    return request.get(`${accountEndpoint}/space`);
  },

  // Get user belonged spaces or related spaces
  getAccountSpaces: async (): Promise<Spaces> => {
    return request.get(`${accountEndpoint}/spaces`);
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

const authEndpoint = '';

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

  // Reset password
  // resetPassword: async (token: string, newPassword: string): Promise<void> => {
  //   return request.post(`${authEndpoint}/reset-password`, { token, newPassword });
  // },

  // Verify email address
  // verifyEmail: async (token: string): Promise<void> => {
  //   return request.post(`${authEndpoint}/verify-email`, { token });
  // }
};

export const getCurrentUser = accountApi.getCurrentUser;
export const getAccountSpace = accountApi.getAccountSpace;
export const getAccountSpaces = accountApi.getAccountSpaces;
export const loginAccount = authApi.login;
export const registerAccount = authApi.register;
export const logoutAccount = authApi.logout;
