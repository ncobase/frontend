import { createContext, useContext, useEffect, useState } from 'react';

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

export const LoginInterceptorProvider = () => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const { updateTokens, isAuthenticated } = useAuthContext();
  const queryClient = useQueryClient();
  const redirect = useRedirectFromUrl();
  const location = useLocation();

  // Prevent multiple simultaneous modal openings
  const [isHandlingAuth, setIsHandlingAuth] = useState(false);

  const open = () => {
    if (!isHandlingAuth && !opened) {
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
      // Only show login modal for non-public routes and when not already authenticated
      if (!Permission.isPublicRoute(location.pathname) && !isAuthenticated) {
        // Add a small delay to prevent rapid-fire modal openings
        timeoutId = setTimeout(() => {
          open();
        }, 100);
      }
    };

    const handleForbidden = () => {
      // For 403 errors, don't show login modal - the Guard component will handle this
      console.warn('Access forbidden - user is authenticated but lacks permissions');
    };

    // Only listen for unauthorized events if user is not authenticated
    if (!isAuthenticated && !Permission.isPublicRoute(location.pathname)) {
      eventEmitter.on('unauthorized', handleUnauthenticated);
    }

    // Always listen for forbidden events but don't open modal
    eventEmitter.on('forbidden', handleForbidden);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      eventEmitter.off('unauthorized', handleUnauthenticated);
      eventEmitter.off('forbidden', handleForbidden);
    };
  }, [location.pathname, isAuthenticated]);

  const handleLogin = () => {
    queryClient.resetQueries();
    close();
    redirect();
  };

  const handleVisible = () => {
    if (opened) {
      updateTokens();
      close();
      redirect();
    } else if (!isHandlingAuth) {
      open();
    }
  };

  return (
    <LoginInterceptorContext.Provider value={{ opened, open, close }}>
      <Modal
        title={t('interceptor.account.title')}
        isOpen={opened}
        onChange={handleVisible}
        description={t('interceptor.account.description')}
      >
        <LoginForm onSuccess={handleLogin} hideRegister hideForgetPassword />
      </Modal>
    </LoginInterceptorContext.Provider>
  );
};
