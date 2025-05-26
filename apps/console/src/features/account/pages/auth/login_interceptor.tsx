import { createContext, useContext, useEffect, useState, useRef } from 'react';

import { Modal } from '@ncobase/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { useAuthContext } from '@/features/account/context';
import { LoginForm } from '@/features/account/pages/auth/login_form';
import { Permission } from '@/features/account/permissions';
import { eventEmitter } from '@/lib/events';
import { useRedirectFromUrl } from '@/router/router.hooks';

interface LoginInterceptorContextValue {
  opened: boolean;
  open: () => void;
  close: () => void;
}

const LoginInterceptorContext = createContext<LoginInterceptorContextValue | undefined>(undefined);

export const useLoginInterceptor = (): LoginInterceptorContextValue => {
  const context = useContext(LoginInterceptorContext);
  if (!context) {
    throw new Error('useLoginInterceptor must be used within a LoginInterceptorProvider');
  }
  return context;
};

export const LoginInterceptorProvider = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const { updateTokens, isAuthenticated } = useAuthContext();
  const queryClient = useQueryClient();
  const redirect = useRedirectFromUrl();
  const location = useLocation();

  // Prevent multiple simultaneous modal openings
  const [isHandlingAuth, setIsHandlingAuth] = useState(false);
  const lastEventTime = useRef<number>(0);
  const eventCooldown = 2000; // 2 seconds cooldown

  const open = () => {
    if (!isHandlingAuth && !opened && !isAuthenticated) {
      setOpened(true);
      setIsHandlingAuth(true);
      queryClient.cancelQueries({ type: 'all' }, { revert: true, silent: true });
    }
  };

  const close = () => {
    setOpened(false);
    setIsHandlingAuth(false);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleUnauthenticated = (_message?: string) => {
      const now = Date.now();

      // Apply cooldown to prevent rapid-fire modal openings
      if (now - lastEventTime.current < eventCooldown) {
        return;
      }

      lastEventTime.current = now;

      // Only show login modal for non-public routes and when not already authenticated
      if (!Permission.isPublicRoute(location.pathname) && !isAuthenticated && !opened) {
        console.debug('Unauthorized access detected, showing login modal');

        // Small delay to prevent immediate modal opening
        timeoutId = setTimeout(() => {
          open();
        }, 100);
      }
    };

    const handleForbidden = (data: { method?: string; url?: string; message?: string }) => {
      // For 403 errors, don't show login modal - navigation will handle redirect
      console.warn('Access forbidden - user is authenticated but lacks permissions:', data);
    };

    const handleServerError = (data: { status?: number; message?: string; url?: string }) => {
      // For server errors, don't show login modal - navigation will handle redirect
      console.warn('Server error occurred:', data);
    };

    const handleNetworkError = (data: { url?: string; message?: string }) => {
      // For network errors, don't show login modal - navigation will handle redirect
      console.warn('Network error occurred:', data);
    };

    const handleLogin = () => {
      // Emit login event for other components to listen
      eventEmitter.emit('login', {
        timestamp: Date.now(),
        path: location.pathname
      });
    };

    const handleLogout = () => {
      // Emit logout event for cleanup
      eventEmitter.emit('logout', {
        timestamp: Date.now(),
        path: location.pathname
      });
      updateTokens();
    };

    // Only listen for unauthorized events when user is not authenticated and not on public routes
    if (!isAuthenticated && !Permission.isPublicRoute(location.pathname)) {
      eventEmitter.on('unauthorized', handleUnauthenticated);
    }

    // Always listen for other events but handle them appropriately
    eventEmitter.on('forbidden', handleForbidden);
    eventEmitter.on('server-error', handleServerError);
    eventEmitter.on('network-error', handleNetworkError);

    // Listen for authentication events
    eventEmitter.on('login', handleLogin);
    eventEmitter.on('logout', handleLogout);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      eventEmitter.off('unauthorized', handleUnauthenticated);
      eventEmitter.off('forbidden', handleForbidden);
      eventEmitter.off('server-error', handleServerError);
      eventEmitter.off('network-error', handleNetworkError);
      eventEmitter.off('login', handleLogin);
      eventEmitter.off('logout', handleLogout);
    };
  }, [location.pathname, isAuthenticated, opened]);

  // Reset state when authentication status changes
  useEffect(() => {
    if (isAuthenticated && opened) {
      close();
    }
  }, [isAuthenticated, opened]);

  // Reset state when route changes to public route
  useEffect(() => {
    if (Permission.isPublicRoute(location.pathname) && opened) {
      close();
    }
  }, [location.pathname, opened]);

  const handleLoginSuccess = () => {
    queryClient.resetQueries();

    // Emit login event
    eventEmitter.emit('login', {
      timestamp: Date.now(),
      path: location.pathname
    });

    close();
    redirect();
  };

  const handleModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      close();
    }
  };

  return (
    <LoginInterceptorContext.Provider value={{ opened, open, close }}>
      {children}
      <Modal
        title={t('interceptor.account.title', 'Session Expired')}
        isOpen={opened}
        onChange={() => handleModalChange(opened)}
        description={t('interceptor.account.description', 'Please login to continue')}
      >
        <LoginForm onSuccess={handleLoginSuccess} hideRegister hideForgetPassword />
      </Modal>
    </LoginInterceptorContext.Provider>
  );
};
