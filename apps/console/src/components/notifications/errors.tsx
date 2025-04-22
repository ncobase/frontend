import { useCallback, useEffect } from 'react';

import { useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { eventEmitter } from '@/lib/events';

export const ErrorNotification = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();

  const handleNetworkError = useCallback(({ message }: { message: string }) => {
    toast.error(t('errors.network_error'), {
      description: message,
      duration: 5000
    });
  }, []);

  const handleServerError = useCallback(
    ({ status, message }: { status: number; message: string; url: string }) => {
      toast.error(t('errors.server_error', { status }), {
        description: message || t('errors.server_error_description'),
        duration: 7000
      });
    },
    []
  );

  const handleClientError = useCallback(
    ({ status, message }: { status: number; message: string; url: string }) => {
      toast.error(t('errors.client_error', { status }), {
        description: message || t('errors.client_error_description'),
        duration: 7000
      });
    },
    []
  );

  const handleUnauthorized = useCallback((message: string) => {
    toast.error(t('errors.unauthorized'), {
      description: message || t('errors.session_expired'),
      duration: 5000
    });
  }, []);

  const handleForbidden = useCallback((message: string) => {
    toast.error(t('errors.forbidden'), {
      description: message || t('errors.no_permission'),
      duration: 5000
    });
  }, []);

  const handleNotFound = useCallback(({ message }: { message: string }) => {
    toast.error(t('errors.not_found'), {
      description: message,
      duration: 5000
    });
  }, []);

  const handleValidationError = useCallback((errors: Record<string, string[]>) => {
    const firstErrorField = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorField]?.[0];

    toast.error(t('errors.validation_error'), {
      description: firstErrorMessage || t('errors.validation_error_description'),
      duration: 5000
    });
  }, []);

  const handleRequestBlocked = useCallback(({ url }: { url: string; message: string }) => {
    toast.error(t('errors.request_blocked'), {
      description: t('errors.request_blocked_description', { url }),
      duration: 10000
    });
  }, []);

  const handleRequestError = useCallback((error: any) => {
    toast.error(t('errors.request_error'), {
      description: error.message,
      duration: 5000
    });
  }, []);

  useEffect(() => {
    eventEmitter.on('network-error', handleNetworkError);
    eventEmitter.on('server-error', handleServerError);
    eventEmitter.on('client-error', handleClientError);
    eventEmitter.on('unauthorized', handleUnauthorized);
    eventEmitter.on('forbidden', handleForbidden);
    eventEmitter.on('not-found', handleNotFound);
    eventEmitter.on('validation-error', handleValidationError);
    eventEmitter.on('request-blocked', handleRequestBlocked);
    eventEmitter.on('request-error', handleRequestError);
    return () => {
      eventEmitter.off('network-error', handleNetworkError);
      eventEmitter.off('server-error', handleServerError);
      eventEmitter.off('client-error', handleClientError);
      eventEmitter.off('unauthorized', handleUnauthorized);
      eventEmitter.off('forbidden', handleForbidden);
      eventEmitter.off('not-found', handleNotFound);
      eventEmitter.off('validation-error', handleValidationError);
      eventEmitter.off('request-blocked', handleRequestBlocked);
      eventEmitter.off('request-error', handleRequestError);
    };
  }, []);

  return null;
};
