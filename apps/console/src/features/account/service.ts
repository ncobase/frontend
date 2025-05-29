import { useCallback, useEffect, useMemo, useState } from 'react';

import { useToastMessage } from '@ncobase/react';
import { AnyObject } from '@ncobase/types';
import { locals } from '@ncobase/utils';
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { FetchError } from 'ofetch';
import { useNavigate } from 'react-router';

import { LoginProps, LoginReply, RegisterProps } from './account';
import { accountApi, loginAccount, logoutAccount, registerAccount } from './apis';
import { Permission } from './permissions';
import { clearTokens } from './token_service';

import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TENANT_KEY,
  useAuthContext
} from '@/features/account/context';
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
  const toast = useToastMessage();
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

        toast.info('Account Unlocked', {
          description: 'You can now attempt to login again.'
        });
      }, lockoutEnd.getTime() - Date.now());

      return () => clearTimeout(timeoutId);
    }
  }, [isLockedOut, lockoutEnd, toast]);

  return useMutation({
    mutationFn: async (variables: LoginProps) => {
      // If locked out, prevent login attempt
      if (isLockedOut) {
        const minutesLeft = Math.ceil((lockoutEnd!.getTime() - Date.now()) / (1000 * 60));
        const lockoutMessage = `Account is temporarily locked. Please try again in ${minutesLeft} minute(s).`;

        toast.warning('Account Locked', {
          description: lockoutMessage,
          duration: 6000
        });

        throw new Error(lockoutMessage);
      }

      try {
        const result = await loginAccount(variables);

        // Reset attempts on successful login
        setLoginAttempts(0);
        sessionStorage.removeItem('login_attempts');
        sessionStorage.removeItem('login_lockout_end');

        // Show success toast
        toast.success('Welcome Back', {
          description: 'You have successfully logged in.'
        });

        // Update tokens in the auth context (session cookie is set by server)
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

          toast.error('Account Locked', {
            description: 'Too many failed login attempts. Account locked for 15 minutes.',
            duration: 8000
          });
        } else {
          // Show failed attempt toast
          toast.error('Login Failed', {
            description: `Invalid credentials. ${5 - newAttempts} attempt(s) remaining.`,
            duration: 5000
          });
        }

        throw error;
      }
    },
    ...options,
    onError: (error, variables, context) => {
      if (!isLockedOut) {
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
  const toast = useToastMessage();

  return useMutation({
    mutationFn: registerAccount,
    ...options,
    onSuccess: (data, variables, context) => {
      // Show success toast
      toast.success('Registration Successful', {
        description: 'Welcome! Your account has been created successfully.'
      });

      // Update tokens in auth context (session cookie is set by server)
      updateTokens(data?.access_token, data?.refresh_token);
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Show error toast
      const errorMessage = error?.data?.message || 'Registration failed. Please try again.';
      toast.error('Registration Failed', {
        description: errorMessage,
        duration: 6000
      });

      options?.onError?.(error, variables, context);
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

  useEffect(() => {
    if (data) {
      Permission.setAccountData(data);
    }
  }, [data]);

  const userRoles = useMemo(() => {
    if (!data || !data.roles) return { isAdmin: false, isSuperAdmin: false };
    const roles = data.roles;
    let isAdmin = false;
    let isSuperAdmin = false;
    for (const role of roles) {
      if (role === 'admin' || role === 'super-admin') {
        isAdmin = true;
      }
      if (role === 'super-admin') {
        isSuperAdmin = true;
      }
    }
    return { isAdmin, isSuperAdmin };
  }, [data]);

  return { ...data, ...userRoles, ...rest };
};

// Hook for user logout
export const useLogout = () => {
  const { updateTokens, clearSession } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToastMessage();

  const handleLogout = useCallback(
    async (options?: { skipApi?: boolean; showToast?: boolean; redirectTo?: string }) => {
      const { skipApi = false, showToast = true, redirectTo = '/login' } = options || {};

      try {
        if (!skipApi) {
          try {
            await logoutAccount();
          } catch (apiError) {
            console.warn('Server logout failed, but continuing with local cleanup:', apiError);
          }
        }

        clearAllLocalData();

        queryClient.clear();

        Permission.clearState();

        clearSession();
        updateTokens();

        eventEmitter.emit('logout', {
          timestamp: Date.now(),
          reason: 'user_initiated'
        });

        if (showToast) {
          toast.success('Logged Out', {
            description: 'You have been successfully logged out.',
            duration: 3000
          });
        }

        setTimeout(() => {
          const currentPath = window.location.pathname + window.location.search;
          const loginUrl =
            redirectTo === '/login'
              ? `/login?redirect=${encodeURIComponent(currentPath)}`
              : redirectTo;

          navigate(loginUrl, { replace: true });
        }, 100);
      } catch (error) {
        console.error('Logout process failed:', error);

        clearAllLocalData();
        clearSession();
        updateTokens();
        Permission.clearState();

        if (showToast) {
          toast.warning('Logout Completed', {
            description: 'There was an issue during logout, but your session has been cleared.',
            duration: 4000
          });
        }

        navigate('/login', { replace: true });
      }
    },
    [updateTokens, clearSession, navigate, queryClient, toast]
  );

  return handleLogout;
};

const clearAllLocalData = () => {
  try {
    locals.remove(ACCESS_TOKEN_KEY);
    locals.remove(REFRESH_TOKEN_KEY);
    locals.remove(TENANT_KEY);

    const authKeys = [
      'app.access.token',
      'app.access.refresh',
      'app.tenant.id',
      'login_attempts',
      'login_lockout_end'
    ];

    authKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    clearTokens();
  } catch (error) {
    console.error('Error clearing local data:', error);
  }
};

// Global logout function
export const globalLogout = async (reason: string = 'unknown') => {
  try {
    await logoutAccount();
  } catch (error) {
    console.warn('Server logout failed during global logout:', error);
  }

  clearAllLocalData();

  eventEmitter.emit('logout', {
    timestamp: Date.now(),
    reason
  });

  window.location.href = '/login';
};

// Hook for auto logout
export const useAutoLogout = () => {
  const logout = useLogout();

  const autoLogout = useCallback(
    (reason: string) => {
      logout({
        skipApi: reason === 'token_expired',
        showToast: true,
        redirectTo: '/login'
      });
    },
    [logout]
  );

  return autoLogout;
};
