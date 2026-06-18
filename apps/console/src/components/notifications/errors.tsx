import { useEffect, useRef } from 'react';

import { useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { eventEmitter } from '@/lib/events';
import { isPublicRoute } from '@/router/helpers/utils';

// ErrorNotification component
export const ErrorNotification = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const location = useLocation();

  // Track last error to prevent duplicates
  const lastErrorRef = useRef<{ type: string; time: number } | null>(null);
  const errorCooldown = 2000; // 2 seconds

  // Handle global error events with debouncing
  useEffect(() => {
    const handleGlobalError = (_event: ErrorEvent) => {
      const now = Date.now();
      const lastError = lastErrorRef.current;

      // Skip if same error type within cooldown period
      if (lastError && lastError.type === 'global' && now - lastError.time < errorCooldown) {
        return;
      }

      lastErrorRef.current = { type: 'global', time: now };

      // Show generic error toast
      toast.error(t('errors.unexpected_error'), {
        description: t('errors.please_try_again')
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const now = Date.now();
      const lastError = lastErrorRef.current;

      // Skip if same error type within cooldown period
      if (lastError && lastError.type === 'rejection' && now - lastError.time < errorCooldown) {
        return;
      }

      lastErrorRef.current = { type: 'rejection', time: now };

      // Check if it's a network or authentication error
      const error = event.reason;

      if (error?.status === 401) {
        event.preventDefault();
        if (!error?.handledByRequest) {
          eventEmitter.emit('unauthorized', {
            message: error?.message,
            url: error?.endpoint,
            data: error?.data
          });
        }

        if (!isPublicRoute(location.pathname)) {
          toast.error(t('errors.session_expired'), {
            description: t('errors.please_login_again')
          });
        }
      } else if (error?.status === 403) {
        event.preventDefault();
        toast.error(t('errors.access_denied'), {
          description: t('errors.insufficient_permissions')
        });
      } else if (error?.status >= 500) {
        event.preventDefault();
        toast.error(t('errors.server_error'), {
          description: t('errors.server_unavailable')
        });
      } else if (!error?.status) {
        event.preventDefault();
        toast.error(t('errors.network_error'), {
          description: t('errors.check_connection')
        });
      }
    };

    // Add global error listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [t, toast, location.pathname]);

  return null;
};
