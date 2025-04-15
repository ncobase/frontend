import { request } from '@/apis/request';
import { Account, Tenant, Tenants } from '@/types';

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
