import { Account, AnyObject, LoginProps, LoginReply, RegisterProps, Tenant } from '@ncobase/types';
import { UseMutationOptions, useMutation, useQuery } from '@tanstack/react-query';
import { FetchError } from 'ofetch';

import { getAccountTenant, getAccountTenants, getCurrentUser } from '@/apis/account/account';
import { loginAccount, registerAccount } from '@/apis/account/authorize';
import { useAuthContext } from '@/features/account/context';

interface AccountKeys {
  login: ['accountService', 'login'];
  register: ['accountService', 'register'];
  account: ['accountService', 'currentUser'];
  tenants: (options?: AnyObject) => ['accountService', 'tenants', AnyObject];
  tenant: (options?: AnyObject) => ['accountService', 'tenant', AnyObject];
}

export const accountKeys: AccountKeys = {
  login: ['accountService', 'login'],
  register: ['accountService', 'register'],
  account: ['accountService', 'currentUser'],
  tenants: (queryKey = {}) => ['accountService', 'tenants', queryKey],
  tenant: (queryKey = {}) => ['accountService', 'tenant', queryKey]
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
    queryFn: (): Promise<Account> => getCurrentUser()
  });
  const isAdministered = account?.is_admin || false;
  return { account, isAdministered, ...rest };
};

export const useAccountTenant = () => {
  const { data: tenant, ...rest } = useQuery({
    queryKey: accountKeys.tenant(),
    queryFn: (): Promise<Tenant> => getAccountTenant()
  });
  return { tenant, ...rest };
};

export const useAccountTenants = (queryKey: AnyObject = {}) => {
  const { data: tenants, ...rest } = useQuery({
    queryKey: accountKeys.tenants(queryKey),
    queryFn: (): Promise<Tenant[]> => getAccountTenants()
  });
  return { tenants, ...rest };
};
