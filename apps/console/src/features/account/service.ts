import { useCallback, useMemo } from 'react';

import { AnyObject, LoginProps, LoginReply, RegisterProps } from '@ncobase/types';
import { useMutation, UseMutationOptions, useQuery } from '@tanstack/react-query';
import { FetchError } from 'ofetch';

import { getCurrentUser } from '@/apis/account/account';
import { loginAccount, logoutAccount, registerAccount } from '@/apis/account/authorize';
import { useAuthContext } from '@/features/account/context';

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
  tenants: (queryKey = {}) => ['accountService', 'tenants', queryKey],
  tenant: (queryKey = {}) => ['accountService', 'tenant', queryKey]
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

  const isAdministered = useMemo(() => {
    return data?.roles?.some(role => ['admin', 'super-admin'].includes(role.slug));
  }, [data?.roles]);

  return { ...data, isAdministered, ...rest };
};

// Account related tenant request merged to useAccount hook
// // Hook to get the current tenant
// export const useAccountTenant = () => {
//   const { data: tenant, ...rest } = useQuery({
//     queryKey: accountKeys.tenant(),
//     queryFn: getAccountTenant
//   });
//   return { tenant, ...rest };
// };

// // Hook to get the list of tenants with pagination
// export const useAccountTenants = (queryKey: AnyObject = {}) => {
//   const { data, ...rest } = useQuery({
//     queryKey: accountKeys.tenants(queryKey),
//     queryFn: getAccountTenants
//   });
//   const tenants = useMemo(() => data?.content || [], [data]);
//   const paginatedResult = usePaginatedData(
//     tenants,
//     queryKey?.cursor as string,
//     queryKey?.limit as number
//   );
//   return { tenants: paginatedResult.data, ...paginatedResult, ...rest };
// };

// // Helper hook for paginated data
// const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
//   const { rs, hasNextPage, nextCursor } = useMemo(
//     () => paginateByCursor(data, cursor, limit) || ({} as ExplicitAny),
//     [data, cursor, limit]
//   );
//   return { data: rs, hasNextPage, nextCursor };
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
