import { useCallback } from 'react';

import { Button, CheckboxField, Form, InputField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { RegisterProps } from '../account';

import { Footer } from '@/components/footer/footer';
import { LanguageSwitcher } from '@/components/language_switcher';
import { Page } from '@/components/layout';
import { Logo } from '@/components/logo';
import { useRegisterAccount } from '@/features/account/service';
import { useRedirectFromUrl } from '@/router';

export const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const redirect = useRedirectFromUrl();
  const queryClient = useQueryClient();

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterProps>();

  const onError = error => {
    const { reason, message } = error?._data || ({} as ExplicitAny);
    // TODO: Notification
    const _notificationProps = {
      title: reason,
      message: message || t(`componnets:errorPage.${reason?.toLowerCase() || 'unknown.label'}`),
      color: 'red',
      withCloseButton: false
    };
  };

  const { mutate: onRegisterAccount } = useRegisterAccount({
    onSuccess: () => {
      queryClient.clear();
      redirect();
    },
    onError
  });

  const onSubmit = handleSubmit(
    useCallback(async (values: RegisterProps) => {
      onRegisterAccount(values);
    }, [])
  );

  return (
    <Page title={t('account.register.title')} layout={false}>
      <div className='absolute top-4 right-4'>
        <LanguageSwitcher />
      </div>
      <div className='flex items-center justify-center flex-col min-h-lvh min-w-full'>
        <div className='p-6 bg-white shadow-xs max-w-2xl w-[38rem] -mt-14 rounded-md'>
          <div className='flex justify-center mb-3 mt-2'>
            <Logo type='full' height='2.25rem' />
          </div>
          <Form
            id='register-form'
            onSubmit={onSubmit}
            noValidate
            className='flex flex-col gap-y-6 mt-10 mb-5'
          >
            <Controller
              name='username'
              control={control}
              defaultValue=''
              rules={{
                required: t('fields.username.required'),
                validate: value => {
                  if (value && !/^[a-zA-Z0-9_]*$/i.test(value)) {
                    return t('fields.username.invalid');
                  } else if (value && value.length < 6) {
                    return t('fields.username.too_short', { count: 6 });
                  } else if (value && value.length > 30) {
                    return t('fields.username.too_long', { count: 30 });
                  }
                }
              }}
              render={({ field }) => (
                <InputField
                  label={t('fields.username.label')}
                  placeholder={t('fields.username.label')}
                  error={errors.username}
                  {...field}
                />
              )}
            />
            <Controller
              name='email'
              control={control}
              defaultValue=''
              rules={{
                required: t('fields.email.required'),
                validate: value => {
                  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
                    return t('fields.email.invalid');
                  }
                }
              }}
              render={({ field }) => (
                <InputField
                  label={t('fields.email.label')}
                  placeholder={t('fields.email.label')}
                  error={errors.email}
                  {...field}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              defaultValue=''
              rules={{
                required: t('fields.password.required'),
                validate: value => {
                  if (value && value.length < 8) {
                    return t('fields.password.too_short', { count: 8 });
                  } else if (value && value.length > 128) {
                    return t('fields.password.too_long', { count: 128 });
                  } else if (value && !/[A-Z]/.test(value)) {
                    return t('fields.password.missing_uppercase');
                  } else if (value && !/[a-z]/.test(value)) {
                    return t('fields.password.missing_lowercase');
                  } else if (value && !/[0-9]/.test(value)) {
                    return t('fields.password.missing_number');
                  } else if (value && !/[^A-Za-z0-9]/.test(value)) {
                    return t('fields.password.missing_symbol');
                  }
                }
              }}
              render={({ field }) => (
                <InputField
                  type='password'
                  label={t('fields.password.label')}
                  placeholder={t('fields.password.label')}
                  error={errors.password}
                  {...field}
                />
              )}
            />
            <Controller
              name='confirm_password'
              control={control}
              defaultValue=''
              rules={{
                required: t('fields.confirm_password.required'),
                validate: value => {
                  if (value !== watch('password')) {
                    return t('fields.confirm_password.mismatch');
                  }
                }
              }}
              render={({ field }) => (
                <InputField
                  type='password'
                  label={t('fields.confirm_password.label')}
                  placeholder={t('fields.confirm_password.label')}
                  error={errors.confirm_password}
                  {...field}
                />
              )}
            />
            <Controller
              name='terms'
              control={control}
              rules={{ required: t('fields.terms.required') }}
              defaultValue={false}
              render={({ field }) => (
                <CheckboxField
                  error={errors.terms}
                  checked={field.value}
                  label={t('fields.terms.label')}
                  {...field}
                />
              )}
            />

            <div className='flex justify-end gap-x-2 mt-2'>
              <Button
                variant='unstyle'
                className='text-slate-400 hover:text-primary-600/90 hover:bg-transparent -ml-3 gap-x-2'
                onClick={() => navigate('/login')}
              >
                {t('actions.already_have_an_account')}
                <strong>{t('actions.login')}</strong>
              </Button>
              <Button type='submit'>{t('actions.register')}</Button>
            </div>
          </Form>
        </div>
        <Footer />
      </div>
    </Page>
  );
};
