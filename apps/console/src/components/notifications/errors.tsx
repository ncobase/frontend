import { useEffect, useRef } from 'react';

import { useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { useAuthContext } from '@/features/account/context';

// ErrorNotification component
export const ErrorNotification = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, updateTokens } = useAuthContext();

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

      if (error?.status === 401 && isAuthenticated) {
        toast.error(t('errors.session_expired'), {
          description: t('errors.please_login_again')
        });

        // Clear tokens and redirect after short delay
        setTimeout(() => {
          updateTokens();
          const currentPath = location.pathname + location.search;
          navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
        }, 1000);
      } else if (error?.status === 403) {
        toast.error(t('errors.access_denied'), {
          description: t('errors.insufficient_permissions')
        });
      } else if (error?.status >= 500) {
        toast.error(t('errors.server_error'), {
          description: t('errors.server_unavailable')
        });
      } else if (!error?.status) {
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
  }, [t, toast, navigate, location, isAuthenticated, updateTokens]);

  return null;
};
