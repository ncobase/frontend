import {
  Account,
  ChangePasswordPayload,
  LoginProps,
  LoginReply,
  MFALoginPayload,
  PasswordPolicy,
  RecoveryCodesReply,
  RegisterAccountPayload,
  SendCodeReply,
  TwoFactorDisablePayload,
  TwoFactorSetupPayload,
  TwoFactorSetupReply,
  TwoFactorStatus,
  TwoFactorVerifyPayload
} from './account';

import type { Space } from '@/features/space/space';
import { request } from '@/lib/api/request';

export interface Spaces {
  items: Space[];
  total: number;
}

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
  },

  getPasswordPolicy: async (): Promise<PasswordPolicy> => {
    return request.get('/password-policy');
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    return request.put(`${accountEndpoint}/password`, payload);
  },

  getTwoFactorStatus: async (): Promise<TwoFactorStatus> => {
    return request.get(`${accountEndpoint}/2fa/status`);
  },

  setupTwoFactor: async (payload: TwoFactorSetupPayload): Promise<TwoFactorSetupReply> => {
    return request.post(`${accountEndpoint}/2fa/setup`, payload);
  },

  verifyTwoFactor: async (payload: TwoFactorVerifyPayload): Promise<RecoveryCodesReply> => {
    return request.post(`${accountEndpoint}/2fa/verify`, payload);
  },

  disableTwoFactor: async (payload: TwoFactorDisablePayload): Promise<void> => {
    return request.post(`${accountEndpoint}/2fa/disable`, payload);
  },

  getTwoFactorBackupCodes: async (): Promise<{ remaining: number }> => {
    return request.get(`${accountEndpoint}/2fa/backup-codes`);
  },

  regenerateTwoFactorBackupCodes: async (
    payload: TwoFactorVerifyPayload
  ): Promise<RecoveryCodesReply> => {
    return request.post(`${accountEndpoint}/2fa/backup-codes/regenerate`, payload);
  }

  /**
   * Extension examples
   */

  // Update current user profile
  // updateProfile: async (profile: Partial<Account>): Promise<Account> => {
  //   return request.put(`${accountEndpoint}/profile`, profile);
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

  loginMFA: async (payload: MFALoginPayload): Promise<LoginReply> => {
    return request.post(`${authEndpoint}/login/mfa`, payload);
  },

  // Register
  register: async (payload: RegisterAccountPayload): Promise<LoginReply> => {
    return request.post(`${authEndpoint}/register`, { ...payload });
  },

  // Logout
  logout: async (): Promise<void> => {
    return request.post(`${authEndpoint}/logout`);
  },

  sendCode: async (email: string): Promise<SendCodeReply> => {
    return request.post(`${authEndpoint}/authorize/send`, { email });
  },

  verifyCode: async (code: string): Promise<LoginReply> => {
    return request.get(`${authEndpoint}/authorize/${encodeURIComponent(code)}`);
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
export const loginMFAAccount = authApi.loginMFA;
export const registerAccount = authApi.register;
export const logoutAccount = authApi.logout;
export const sendAuthCode = authApi.sendCode;
export const verifyAuthCode = authApi.verifyCode;
