import { createContext, useContext, useEffect, useState, useRef } from 'react';

import { Modal } from '@ncobase/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { useAuthContext } from '@/features/account/context';
import { LoginForm } from '@/features/account/pages/auth/login_form';
import { eventEmitter } from '@/lib/events';
import { isPublicRoute } from '@/router/helpers/utils';
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
  const EVENT_COOLDOWN = 2000; // 2 seconds cooldown

  const open = () => {
    if (!isHandlingAuth && !opened && !isAuthenticated && !isPublicRoute(location.pathname)) {
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

    const handleUnauthenticated = () => {
      const now = Date.now();

      // Apply cooldown to prevent rapid-fire modal openings
      if (now - lastEventTime.current < EVENT_COOLDOWN) {
        return;
      }

      lastEventTime.current = now;

      // Only show login modal for non-public routes when not authenticated
      if (!isPublicRoute(location.pathname) && !isAuthenticated && !opened) {
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

    // Listen for authentication events
    if (!isAuthenticated && !isPublicRoute(location.pathname)) {
      eventEmitter.on('unauthorized', handleUnauthenticated);
    }

    eventEmitter.on('forbidden', handleForbidden);
    eventEmitter.on('login', handleLogin);
    eventEmitter.on('logout', handleLogout);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      eventEmitter.off('unauthorized', handleUnauthenticated);
      eventEmitter.off('forbidden', handleForbidden);
      eventEmitter.off('login', handleLogin);
      eventEmitter.off('logout', handleLogout);
    };
  }, [location.pathname, isAuthenticated, opened, updateTokens]);

  // Reset state when authentication status changes
  useEffect(() => {
    if (isAuthenticated && opened) {
      close();
    }
  }, [isAuthenticated, opened]);

  // Reset state when route changes to public route
  useEffect(() => {
    if (isPublicRoute(location.pathname) && opened) {
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
