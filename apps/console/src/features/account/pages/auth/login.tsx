import { Button, Divider, Icons, Tooltip, TooltipContent, TooltipTrigger } from '@ncobase/react';
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
      <div className='absolute top-4 right-4'>
        <LanguageSwitcher />
      </div>
      <div className='flex items-center justify-center flex-col min-h-lvh min-w-full'>
        <div className='p-6 bg-white shadow-xs max-w-2xl w-[38rem] -mt-14 rounded-md'>
          <Logo className='mx-auto mt-6 mb-12 py-1.5 drop-shadow-xl shadow-slate-900' type='full' />
          <LoginForm onSuccess={onLogin} />
          <Divider label='OR' style='dashed' className='my-2' />
          <div className='flex gap-x-8 items-center mb-5 justify-center'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='unstyle' className='rounded-full bg-gray-600 p-2' size='ratio'>
                  <Icons name='IconBrandGoogle' className='stroke-white! stroke-2!' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>Google</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='unstyle' className='rounded-full bg-gray-600 p-2' size='ratio'>
                  <Icons name='IconBrandGithub' className='stroke-white! stroke-2!' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>Github</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='unstyle' className='rounded-full bg-gray-600 p-2' size='ratio'>
                  <Icons name='IconBrandTiktok' className='stroke-white! stroke-2!' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>Tiktok</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <Footer />
      </div>
    </Page>
  );
};
