import { useCallback, useMemo, useState } from 'react';

import { useToastMessage } from '@ncobase/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FetchError } from 'ofetch';
import { useNavigate } from 'react-router';

import { LoginProps } from './account';
import { accountApi, loginAccount, logoutAccount, registerAccount } from './apis';
import { useAuthContext } from './context';
import { clearTokens } from './token_service';

// Query keys
export const accountKeys = {
  login: ['accountService', 'login'],
  register: ['accountService', 'register'],
  currentUser: ['accountService', 'currentUser'],
  spaces: (params = {}) => ['accountService', 'spaces', params],
  space: (params = {}) => ['accountService', 'space', params]
};

// Login hook
export const useLogin = (options?: { onSuccess?: () => void; onError?: (_error: any) => void }) => {
  const { updateTokens } = useAuthContext();
  const toast = useToastMessage();
  const [loginAttempts, setLoginAttempts] = useState(0);
  const MAX_ATTEMPTS = 5;

  return useMutation({
    mutationFn: async (variables: LoginProps) => {
      if (loginAttempts >= MAX_ATTEMPTS) {
        throw new Error('Too many failed login attempts. Please try again later.');
      }

      try {
        const result = await loginAccount(variables);

        // Reset attempts on success
        setLoginAttempts(0);
        sessionStorage.removeItem('login_attempts');

        toast.success('Welcome Back', {
          description: 'You have successfully logged in.'
        });

        updateTokens(result.access_token, result.refresh_token);
        return result;
      } catch (error) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        sessionStorage.setItem('login_attempts', String(newAttempts));

        if (newAttempts >= MAX_ATTEMPTS) {
          toast.error('Account Locked', {
            description: 'Too many failed login attempts. Please try again later.',
            duration: 8000
          });
        } else {
          toast.error('Login Failed', {
            description: `Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`,
            duration: 5000
          });
        }

        throw error;
      }
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError
  });
};

// Register hook
export const useRegisterAccount = (options?: {
  onSuccess?: () => void;
  onError?: (_error: any) => void;
}) => {
  const { updateTokens } = useAuthContext();
  const toast = useToastMessage();

  return useMutation({
    mutationFn: registerAccount,
    onSuccess: data => {
      toast.success('Registration Successful', {
        description: 'Welcome! Your account has been created successfully.'
      });

      updateTokens(data?.access_token, data?.refresh_token);
      options?.onSuccess?.();
    },
    onError: (error: FetchError) => {
      const errorMessage = error?.data?.message || 'Registration failed. Please try again.';
      toast.error('Registration Failed', {
        description: errorMessage,
        duration: 6000
      });

      options?.onError?.(error);
    }
  });
};

// Current user hook
export const useAccount = () => {
  const { data, ...rest } = useQuery({
    queryKey: accountKeys.currentUser,
    queryFn: accountApi.getCurrentUser,
    staleTime: 1000 * 60 * 15 // 15 minutes
  });

  const userRoles = useMemo(() => {
    if (!data?.roles) return { isAdmin: false, isSuperAdmin: false };

    const roles = data.roles;
    const isAdmin = roles.some(role => ['admin', 'super-admin'].includes(role));
    const isSuperAdmin = roles.includes('super-admin');

    return { isAdmin, isSuperAdmin };
  }, [data]);

  return { ...data, ...userRoles, ...rest };
};

// Logout hook
export const useLogout = () => {
  const { updateTokens, clearSession } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToastMessage();

  return useCallback(
    async (options?: { skipApi?: boolean; showToast?: boolean; redirectTo?: string }) => {
      const { skipApi = false, showToast = true, redirectTo = '/login' } = options || {};

      try {
        // Call logout API unless skipped
        if (!skipApi) {
          try {
            await logoutAccount();
          } catch (error) {
            console.warn('Server logout failed, continuing with local cleanup:', error);
          }
        }

        // Clear local data
        clearTokens();
        clearSession();
        updateTokens();
        queryClient.clear();

        if (showToast) {
          toast.success('Logged Out', {
            description: 'You have been successfully logged out.',
            duration: 3000
          });
        }

        // Redirect to login
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

        // Force cleanup on error
        clearTokens();
        clearSession();
        updateTokens();

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
};
