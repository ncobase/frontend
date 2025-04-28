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
  const { updateTokens } = useAuthContext();
  const queryClient = useQueryClient();
  const redirect = useRedirectFromUrl();
  const location = useLocation();

  const open = () => {
    setOpened(true);
    queryClient.cancelQueries({ type: 'all' }, { revert: true, silent: true });
  };

  const close = () => setOpened(false);

  useEffect(() => {
    const handleUnauthenticated = () => {
      open();
    };

    if (!Permission.isPublicRoute(location.pathname)) {
      eventEmitter.on('unauthorized', handleUnauthenticated);
    }

    return () => {
      eventEmitter.off('unauthorized', handleUnauthenticated);
    };
  }, [location.pathname]);

  const handleLogin = () => {
    queryClient.resetQueries();
    close();
  };

  const handleVisible = () => {
    if (opened) {
      updateTokens();
      close();
      redirect();
    } else {
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
