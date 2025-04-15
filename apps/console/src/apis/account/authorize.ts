import { accountApi } from './account';

import { request } from '@/apis/request';
import { LoginProps, LoginReply, RegisterProps } from '@/types';

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
