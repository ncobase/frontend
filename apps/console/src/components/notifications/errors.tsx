import { useEffect, useRef } from 'react';

import { useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { useAuthContext } from '@/features/account/context';
import { eventEmitter } from '@/lib/events';

export const ErrorNotification = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, updateTokens } = useAuthContext();

  // Use refs to prevent multiple simultaneous error handling
  const handlingError = useRef(false);
  const lastErrorTime = useRef(0);
  const ERROR_THROTTLE_TIME = 2000; // 2 seconds

  const shouldHandleError = (): boolean => {
    const now = Date.now();
    if (now - lastErrorTime.current < ERROR_THROTTLE_TIME) {
      return false;
    }
    if (handlingError.current) {
      return false;
    }
    lastErrorTime.current = now;
    handlingError.current = true;
    setTimeout(() => {
      handlingError.current = false;
    }, ERROR_THROTTLE_TIME);
    return true;
  };

  useEffect(() => {
    const handleUnauthorized = (message: string) => {
      if (!shouldHandleError()) return;

      console.warn('Unauthorized access detected');

      // Only show toast and handle logout if user was previously authenticated
      if (isAuthenticated) {
        toast.error(t('errors.unauthorized'), {
          description: message || t('errors.session_expired')
        });

        // Clear tokens and redirect to login
        updateTokens();
        const currentPath = location.pathname + location.search;

        // Delay navigation to allow toast to dismiss
        setTimeout(() => {
          navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
        }, 1000);
      }
    };

    const handleForbidden = (data: { method?: string; url?: string; message?: string }) => {
      if (!shouldHandleError()) return;

      console.warn('Access forbidden:', data);

      // Show toast notification for forbidden access
      toast.error(t('errors.forbidden'), {
        description: data.message || t('errors.insufficient_permissions')
      });

      // For 403 errors, no redirect is needed as the Guard component handles it
      // However, redirecting to homepage or other authorized pages can be considered in certain cases
    };

    const handleServerError = (data: { status?: number; message?: string; url?: string }) => {
      if (!shouldHandleError()) return;

      console.error('Server error:', data);

      toast.error(t('errors.server_error'), {
        description: data.message || t('errors.something_went_wrong')
      });
    };

    const handleNetworkError = (data: { method?: string; url?: string; message?: string }) => {
      if (!shouldHandleError()) return;

      console.error('Network error:', data);

      toast.error(t('errors.network_error'), {
        description: data.message || t('errors.check_connection')
      });
    };

    const handleValidationError = (errors: Record<string, string[]>) => {
      if (!shouldHandleError()) return;

      console.warn('Validation errors:', errors);

      // Show first validation error
      const firstError = Object.values(errors)[0]?.[0];
      if (firstError) {
        toast.error(t('errors.validation_error'), {
          description: firstError
        });
      }
    };

    const handleRequestBlocked = (data: { method?: string; url?: string; message?: string }) => {
      if (!shouldHandleError()) return;

      console.warn('Request blocked:', data);

      toast.warning(t('errors.request_blocked'), {
        description: data.message || t('errors.too_many_failures')
      });
    };

    const handleNotFound = (data: { url?: string; message?: string }) => {
      if (!shouldHandleError()) return;

      console.warn('Resource not found:', data);

      toast.warning(t('errors.not_found'), {
        description: data.message || t('errors.resource_not_found')
      });
    };

    const handleAccountLocked = (data: { duration?: number; message?: string }) => {
      if (!shouldHandleError()) return;

      console.warn('Account locked:', data);

      const message = data.duration
        ? t('errors.account_locked_with_duration', { minutes: data.duration })
        : t('errors.account_locked');

      toast.error(t('errors.account_locked'), {
        description: message
      });
    };

    const handleTenantError = (data: { message?: string }) => {
      if (!shouldHandleError()) return;

      console.warn('Tenant error:', data);

      toast.error(t('errors.tenant_error'), {
        description: data.message || t('errors.tenant_access_error')
      });
    };

    // Register event listeners
    eventEmitter.on('unauthorized', handleUnauthorized);
    eventEmitter.on('forbidden', handleForbidden);
    eventEmitter.on('server-error', handleServerError);
    eventEmitter.on('network-error', handleNetworkError);
    eventEmitter.on('validation-error', handleValidationError);
    eventEmitter.on('request-blocked', handleRequestBlocked);
    eventEmitter.on('not-found', handleNotFound);
    eventEmitter.on('account-locked', handleAccountLocked);
    eventEmitter.on('tenant-error', handleTenantError);

    return () => {
      // Cleanup event listeners
      eventEmitter.off('unauthorized', handleUnauthorized);
      eventEmitter.off('forbidden', handleForbidden);
      eventEmitter.off('server-error', handleServerError);
      eventEmitter.off('network-error', handleNetworkError);
      eventEmitter.off('validation-error', handleValidationError);
      eventEmitter.off('request-blocked', handleRequestBlocked);
      eventEmitter.off('not-found', handleNotFound);
      eventEmitter.off('account-locked', handleAccountLocked);
      eventEmitter.off('tenant-error', handleTenantError);
    };
  }, [t, toast, navigate, location, isAuthenticated, updateTokens]);

  return null;
};
