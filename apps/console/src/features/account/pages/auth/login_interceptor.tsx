import { createContext, useContext, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Modal } from '@/components/modal/modal';
import { useAuthContext } from '@/features/account/context';
import { LoginForm } from '@/features/account/pages/auth/login_form';
import { eventEmitter } from '@/helpers/events';
import { useRedirectFromUrl } from '@/router/router.hooks';
import { publicRoutes } from '@/router/routes';

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

    if (!publicRoutes.includes(location.pathname)) {
      eventEmitter.on('unauthorized', handleUnauthenticated);
    }

    return () => {
      eventEmitter.off('unauthorized', handleUnauthenticated);
    };
  }, []);

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
        className='max-w-[475px] max-h-[365px]'
        description={t('interceptor.account.description')}
      >
        <LoginForm onSuccess={handleLogin} hideRegister hideForgetPassword />
      </Modal>
    </LoginInterceptorContext.Provider>
  );
};
