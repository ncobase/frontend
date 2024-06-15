import {
  AnyObject,
  ExplicitAny,
  LoginProps,
  LoginReply,
  RegisterProps,
  Tenant,
  Tenants
} from '@ncobase/types';
import { UseMutationOptions, useMutation, useQuery } from '@tanstack/react-query';
import { FetchError } from 'ofetch';

import { getCurrentUser } from '@/apis/account/account';
import { loginAccount, registerAccount } from '@/apis/account/authorize';
import { getUserTenant, getUserTenants } from '@/apis/account/tenant';
import { useAuthContext } from '@/features/account/context';
import { paginateByCursor } from '@/helpers/pagination';

interface AccountKeys {
  login: ['accountService', 'login'];
  register: ['accountService', 'register'];
  account: ['accountService', 'currentUser'];
  tenants: (options?: AnyObject) => ['accountService', 'tenants', AnyObject];
  tenant: (options?: { id?: string }) => ['accountService', 'tenant', { id?: string }];
}

export const accountKeys: AccountKeys = {
  login: ['accountService', 'login'],
  register: ['accountService', 'register'],
  account: ['accountService', 'currentUser'],
  tenants: (queryKey = {}) => ['accountService', 'tenants', queryKey],
  tenant: ({ id } = {}) => ['accountService', 'tenant', { id }]
};

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

export const useLogin = (
  options?: Partial<UseMutationOptions<LoginReply, FetchError, LoginProps>>
) => useMutationWithTokens(payload => loginAccount(payload), options);

export const useRegisterAccount = (
  options?: Partial<UseMutationOptions<LoginReply, FetchError, RegisterProps>>
) => useMutationWithTokens(payload => registerAccount(payload), options);

export const useAccount = () => {
  const { data: account, ...rest } = useQuery({
    queryKey: accountKeys.account,
    queryFn: getCurrentUser
  });
  const isAdministered = true; // !!account?.authorities?.includes('ADMIN') || account?.administered;
  return { ...account, isAdministered, ...rest };
};

export const useUserTenants = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: accountKeys.tenants(queryKey),
    queryFn: (): Promise<Tenants> => getUserTenants(queryKey)
  });
  const { content: tenants = [] } = data || {};
  const { cursor, limit } = queryKey;
  const { rs, hasNextPage, nextCursor } =
    (tenants && paginateByCursor(tenants, cursor as string, limit as number)) ||
    ({} as ExplicitAny);
  return { tenants: rs, hasNextPage, nextCursor, ...rest };
};

export const useUserTenant = (id?: string) => {
  if (!id) {
    return { tenant: undefined };
  }
  const { data: tenant, ...rest } = useQuery({
    queryKey: accountKeys.tenant({ id }),
    queryFn: (): Promise<Tenant> => getUserTenant(id)
  });
  return { tenant, ...rest };
};
