import { useCallback, useEffect, useMemo, useState } from 'react';

import { AnyObject } from '@ncobase/types';
import { useMutation, UseMutationOptions, useQuery } from '@tanstack/react-query';
import { FetchError } from 'ofetch';

import { LoginProps, LoginReply, RegisterProps } from './account';
import { accountApi, loginAccount, logoutAccount, registerAccount } from './apis';

import { useAuthContext } from '@/features/account/context';
import { eventEmitter } from '@/lib/events';

interface AccountKeys {
  login: ['accountService', 'login'];
  register: ['accountService', 'register'];
  currentUser: ['accountService', 'currentUser'];
  tenants: (_options?: AnyObject) => ['accountService', 'tenants', AnyObject];
  tenant: (_options?: AnyObject) => ['accountService', 'tenant', AnyObject];
}

export const accountKeys: AccountKeys = {
  login: ['accountService', 'login'],
  register: ['accountService', 'register'],
  currentUser: ['accountService', 'currentUser'],
  tenants: (queryParams = {}) => ['accountService', 'tenants', queryParams],
  tenant: (queryParams = {}) => ['accountService', 'tenant', queryParams]
};

// Hook for user login
export const useLogin = (
  options?: Partial<UseMutationOptions<LoginReply, FetchError, LoginProps>>
) => {
  const { updateTokens } = useAuthContext();
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutEnd, setLockoutEnd] = useState<Date | null>(null);

  // Check for existing lockout in sessionStorage
  useEffect(() => {
    const storedLockoutEnd = sessionStorage.getItem('login_lockout_end');
    if (storedLockoutEnd) {
      const endTime = new Date(storedLockoutEnd);
      if (endTime > new Date()) {
        setIsLockedOut(true);
        setLockoutEnd(endTime);
      } else {
        sessionStorage.removeItem('login_lockout_end');
        sessionStorage.removeItem('login_attempts');
      }
    }

    const storedAttempts = sessionStorage.getItem('login_attempts');
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts, 10));
    }
  }, []);

  // Reset lockout status when lockout period expires
  useEffect(() => {
    if (isLockedOut && lockoutEnd) {
      const timeoutId = setTimeout(() => {
        setIsLockedOut(false);
        setLockoutEnd(null);
        setLoginAttempts(0);
        sessionStorage.removeItem('login_lockout_end');
        sessionStorage.removeItem('login_attempts');
      }, lockoutEnd.getTime() - Date.now());

      return () => clearTimeout(timeoutId);
    }
  }, [isLockedOut, lockoutEnd]);

  return useMutation({
    mutationFn: async (variables: LoginProps) => {
      // If locked out, prevent login attempt
      if (isLockedOut) {
        throw new Error('Account is temporarily locked. Please try again later.');
      }

      try {
        const result = await loginAccount(variables);

        // Reset attempts on successful login
        setLoginAttempts(0);
        sessionStorage.removeItem('login_attempts');

        // Update tokens in the auth context
        updateTokens(result.access_token, result.refresh_token);

        return result;
      } catch (error) {
        // Increment attempts on failure
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        sessionStorage.setItem('login_attempts', String(newAttempts));

        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          const lockoutDuration = 15 * 60 * 1000; // 15 minutes
          const end = new Date(Date.now() + lockoutDuration);
          setIsLockedOut(true);
          setLockoutEnd(end);
          sessionStorage.setItem('login_lockout_end', end.toISOString());
        }

        throw error;
      }
    },
    ...options,
    onError: (error, variables, context) => {
      if (isLockedOut) {
        // Custom error notification for lockout
        eventEmitter.emit('account-locked', {
          duration: Math.ceil((lockoutEnd!.getTime() - Date.now()) / (1000 * 60)),
          message: 'Account is temporarily locked. Please try again later.'
        });
      } else {
        options?.onError?.(error, variables, context);
      }
    }
  });
};

// Hook for user registration
export const useRegisterAccount = (
  options?: Partial<UseMutationOptions<LoginReply, FetchError, RegisterProps>>
) => {
  const { updateTokens } = useAuthContext();

  return useMutation({
    mutationFn: registerAccount,
    ...options,
    onSuccess: (data, variables, context) => {
      // Update tokens in auth context
      updateTokens(data?.access_token, data?.refresh_token);
      options?.onSuccess?.(data, variables, context);
    }
  });
};

// Hook to get the current account data
export const useAccount = () => {
  const { data, ...rest } = useQuery({
    queryKey: accountKeys.currentUser,
    queryFn: accountApi.getCurrentUser,
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
      updateTokens(); // Clear tokens
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear tokens even if the API call fails
      updateTokens();
    }
  }, [updateTokens]);

  return handleLogout;
};
