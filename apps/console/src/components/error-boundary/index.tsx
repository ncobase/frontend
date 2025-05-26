import { useEffect, useState } from 'react';

import { Button, CodeHighlighter, Container, Dialog, useToastMessage } from '@ncobase/react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import { ErrorPage } from '../errors';

import { eventEmitter } from '@/lib/events';

interface ErrorState {
  hasError: boolean;
  errorType: 'server' | 'forbidden' | 'not-found' | 'network' | 'boundary';
  errorData?: any;
}

const FallbackComponent = ({
  error,
  children
}: {
  error?: FallbackProps;
  children?: React.ReactNode;
}) => {
  if (children) return <>{children}</>;

  const { t } = useTranslation();

  return (
    <Container className='flex items-center justify-center w-lvw h-lvh'>
      <Dialog
        className='w-[78lvw]! h-[76lvh]! max-w-[90lvw]! max-h-[86lvh]!'
        trigger={
          <Button variant='outline-danger' title={t('actions.expand')}>
            {t('errors.boundary.label')}
          </Button>
        }
      >
        <CodeHighlighter language='json' className='h-full my-0! text-wrap'>
          {error?.error?.stack || 'Unknown error occurred'}
        </CodeHighlighter>
      </Dialog>
    </Container>
  );
};

export const ErrorBoundary: React.FC<React.PropsWithChildren> = ({ children }) => {
  const toast = useToastMessage();
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    errorType: 'boundary'
  });

  // Handle server errors - show toast and set state for page redirect
  const handleServerError = (data: { status?: number; message?: string; url?: string }) => {
    toast.error('Server Error', {
      description: data.message || 'An internal server error occurred. Please try again later.',
      duration: 6000
    });

    setErrorState({
      hasError: true,
      errorType: 'server',
      errorData: data
    });
  };

  // Handle forbidden errors - show toast and set state for page redirect
  const handleForbidden = (data: { url?: string; message?: string }) => {
    toast.error('Access Denied', {
      description: data.message || 'You do not have permission to access this resource',
      duration: 5000
    });

    setErrorState({
      hasError: true,
      errorType: 'forbidden',
      errorData: data
    });
  };

  // Handle not found errors - show toast and set state for page redirect
  const handleNotFound = (data: { url?: string; message?: string }) => {
    toast.warning('Not Found', {
      description: data.message || 'The requested resource was not found',
      duration: 4000
    });

    setErrorState({
      hasError: true,
      errorType: 'not-found',
      errorData: data
    });
  };

  // Handle network errors - show toast and set state for page redirect
  const handleNetworkError = (data: { url?: string; message?: string }) => {
    toast.error('Network Error', {
      description: 'Unable to connect to server. Please check your connection.',
      duration: 6000
    });

    setErrorState({
      hasError: true,
      errorType: 'network',
      errorData: data
    });
  };

  // Handle validation errors - show toast only, don't redirect
  const handleValidationError = (errors: Record<string, string[]>) => {
    const errorMessages = Object.values(errors).flat();
    if (errorMessages.length > 0) {
      toast.error('Validation Error', {
        description: errorMessages.join(', '),
        duration: 5000
      });
    }
  };

  useEffect(() => {
    // Listen for API error events
    eventEmitter.on('server-error', handleServerError);
    eventEmitter.on('forbidden', handleForbidden);
    eventEmitter.on('not-found', handleNotFound);
    eventEmitter.on('network-error', handleNetworkError);
    eventEmitter.on('validation-error', handleValidationError);

    return () => {
      eventEmitter.off('server-error', handleServerError);
      eventEmitter.off('forbidden', handleForbidden);
      eventEmitter.off('not-found', handleNotFound);
      eventEmitter.off('network-error', handleNetworkError);
      eventEmitter.off('validation-error', handleValidationError);
    };
  }, [toast]);

  // Reset error state on route change or manual retry
  const resetError = () => {
    setErrorState({
      hasError: false,
      errorType: 'boundary'
    });
  };

  // Handle React error boundary fallback
  const handleErrorBoundary = (error: Error, errorInfo: any) => {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    toast.error('Application Error', {
      description: 'An unexpected error occurred. Please refresh the page.',
      duration: 8000
    });
    setErrorState({
      hasError: true,
      errorType: 'boundary',
      errorData: { error, errorInfo }
    });
  };

  // Render error page based on error type
  const renderErrorPage = () => {
    switch (errorState.errorType) {
      case 'server':
        return <ErrorPage code={500} onRetry={resetError} />;
      case 'forbidden':
        return <ErrorPage code={403} onRetry={resetError} />;
      case 'not-found':
        return <ErrorPage code={404} onRetry={resetError} />;
      case 'network':
        return <ErrorPage code='network' onRetry={resetError} />;
      case 'boundary':
      default:
        return (
          <FallbackComponent error={errorState.errorData}>
            <ErrorPage code={500} onRetry={resetError} />
          </FallbackComponent>
        );
    }
  };

  // If we have an API error, render the error page directly
  if (errorState.hasError) {
    return renderErrorPage();
  }

  // Otherwise, use React Error Boundary for component errors
  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleErrorBoundary}
      onReset={resetError}
    >
      {children}
    </ReactErrorBoundary>
  );
};
