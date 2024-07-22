import { useCallback, useMemo } from 'react';

import { useMutation, UseMutationOptions, useQuery } from '@tanstack/react-query';
import { FetchError } from 'ofetch';

import { getCurrentUser } from '@/apis/account/account';
import { loginAccount, logoutAccount, registerAccount } from '@/apis/account/authorize';
import { useAuthContext } from '@/features/account/context';
import { AnyObject, LoginProps, LoginReply, RegisterProps } from '@/types';

interface AccountKeys {
  login: ['accountService', 'login'];
  register: ['accountService', 'register'];
  currentUser: ['accountService', 'currentUser'];
  tenants: (options?: AnyObject) => ['accountService', 'tenants', AnyObject];
  tenant: (options?: AnyObject) => ['accountService', 'tenant', AnyObject];
}

export const accountKeys: AccountKeys = {
  login: ['accountService', 'login'],
  register: ['accountService', 'register'],
  currentUser: ['accountService', 'currentUser'],
  tenants: (queryParams = {}) => ['accountService', 'tenants', queryParams],
  tenant: (queryParams = {}) => ['accountService', 'tenant', queryParams]
};

// Custom hook for mutations that involve token updates
const useMutationWithTokens = <TVariables>(
  mutationFn: (variables: TVariables) => Promise<LoginReply>,
  options?: Partial<UseMutationOptions<LoginReply, FetchError, TVariables>>
) => {
  const { updateTokens } = useAuthContext();
  return useMutation({
    mutationFn,
    ...options,
    onSuccess: (data, ...rest) => {
      updateTokens(data?.access_token, data?.refresh_token);
      options?.onSuccess?.(data, ...rest);
    }
  });
};

// Hook for user login
export const useLogin = (
  options?: Partial<UseMutationOptions<LoginReply, FetchError, LoginProps>>
) => useMutationWithTokens(loginAccount, options);

// Hook for user registration
export const useRegisterAccount = (
  options?: Partial<UseMutationOptions<LoginReply, FetchError, RegisterProps>>
) => useMutationWithTokens(registerAccount, options);

// Hook to get the current account data
export const useAccount = () => {
  const { data, ...rest } = useQuery({
    queryKey: accountKeys.currentUser,
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 15 // 15 minutes
  });

  const userRoles = useMemo(() => {
    if (!data || !data.roles) return { isAdmin: false, isSuperAdmin: false };
    let isAdmin = false;
    let isSuperAdmin = false;
    for (const role of data.roles) {
      if (role.slug === 'admin' || role.slug === 'super-admin') {
        isAdmin = true;
      }
      if (role.slug === 'super-admin') {
        isSuperAdmin = true;
      }
    }
    return { isAdmin, isSuperAdmin };
  }, [data]);

  return { ...data, ...userRoles, ...rest };
};

// // Account related tenant request merged to useAccount hook
// // Hook to get the current tenant
// export const useAccountTenant = () => {
//   const { data: tenant, ...rest } = useQuery({
//     queryKey: accountKeys.tenant(),
//     queryFn: getAccountTenant
//   });
//   return { tenant, ...rest };
// };

// // Hook to get the list of tenants
// export const useAccountTenants = (queryParams: QueryFormParams) => {
//   return useQuery({
//     queryKey: accountKeys.tenants(queryParams),
//     queryFn: getAccountTenants
//   });
// };

// Hook for user logout
export const useLogout = () => {
  const { updateTokens } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await logoutAccount();
      updateTokens(null, null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [updateTokens]);

  return handleLogout;
};
