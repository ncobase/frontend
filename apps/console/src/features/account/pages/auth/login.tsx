import { Button, Divider, Icons, Tooltip } from '@ncobase/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Footer } from '@/components/footer/footer';
import { LanguageSwitcher } from '@/components/language_switcher';
import { Page } from '@/components/layout';
import { Logo } from '@/components/logo';
import { LoginForm } from '@/features/account/pages/auth/login_form';
import { useRedirectFromUrl } from '@/router/router.hooks';

export const Login = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const redirect = useRedirectFromUrl();

  const onLogin = () => {
    queryClient.clear();
    redirect();
  };

  return (
    <Page title={t('account.login.title')} layout={false}>
      <div className='fixed inset-0 bg-gradient-to-br from-blue-50 via-primary-100 to-success-50 opacity-25' />
      <div className='absolute top-4 right-4 z-10'>
        <LanguageSwitcher />
      </div>
      <div className='relative flex flex-col items-center justify-center min-h-lvh z-10 px-4'>
        <div className='bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 w-full max-w-xl'>
          <Logo
            className='mx-auto mt-4 mb-10 py-1.5 drop-shadow-xl shadow-slate-900 w-40'
            type='full'
          />
          <LoginForm onSuccess={onLogin} />
          <Divider label='OR' style='dashed' className='my-6' />
          <div className='flex justify-center gap-6'>
            {[
              { name: 'Google', icon: 'IconBrandGoogle' },
              { name: 'Github', icon: 'IconBrandGithub' },
              { name: 'Tiktok', icon: 'IconBrandTiktok' }
            ].map(({ name, icon }) => (
              <Tooltip key={name} side='bottom' content={name}>
                <Button
                  variant='unstyle'
                  className='rounded-full bg-gray-700 hover:bg-gray-800 transition-all p-3 shadow-md'
                  size='ratio'
                >
                  <Icons name={icon} className='stroke-white! stroke-2!' />
                </Button>
              </Tooltip>
            ))}
          </div>
        </div>
        <div className='mt-10 text-gray-600'>
          <Footer />
        </div>
      </div>
    </Page>
  );
};
