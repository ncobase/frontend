import { useCallback } from 'react';

import { Button, CheckboxField, Form, Icons, InputField, useToastMessage } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { RegisterProps } from '../account';
import {
  getPasswordPolicyIssues,
  normalizePasswordPolicy,
  PasswordPolicyIssue
} from '../password_policy';

import { Footer } from '@/components/footer/footer';
import { LanguageSwitcher } from '@/components/language_switcher';
import { Page } from '@/components/layout';
import { Logo } from '@/components/logo';
import { useNotificationService } from '@/components/notifications/notification.service';
import {
  usePasswordPolicy,
  useRegisterAccount,
  useSendRegisterCode,
  useVerifyRegisterCode
} from '@/features/account/service';
import { useRedirectFromUrl } from '@/router';

const passwordIssueMessage = (
  issue: PasswordPolicyIssue,
  minLength: number,
  t: ReturnType<typeof useTranslation>['t']
) => {
  switch (issue) {
    case 'min_length':
      return t('fields.password.too_short', { count: minLength });
    case 'require_uppercase':
      return t('fields.password.missing_uppercase');
    case 'require_lowercase':
      return t('fields.password.missing_lowercase');
    case 'require_numbers':
      return t('fields.password.missing_number');
    case 'require_symbols':
      return t('fields.password.missing_symbol');
    default:
      return t('fields.password.invalid', 'Password does not meet the policy.');
  }
};

export const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const redirect = useRedirectFromUrl();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationService();
  const toast = useToastMessage();
  const { data: loadedPasswordPolicy } = usePasswordPolicy();
  const passwordPolicy = normalizePasswordPolicy(loadedPasswordPolicy);

  const {
    control,
    watch,
    getValues,
    trigger,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterProps>();

  const onError = error => {
    const { reason, message } = error?._data || ({} as ExplicitAny);
    addNotification({
      title: reason || t('common.error'),
      description: message || t(`componnets:errorPage.${reason?.toLowerCase() || 'unknown.label'}`),
      type: 'error'
    });
  };

  const { mutate: onRegisterAccount, isPending: isRegistering } = useRegisterAccount({
    onSuccess: () => {
      queryClient.clear();
      redirect();
    },
    onError
  });
  const sendCode = useSendRegisterCode();
  const verifyCode = useVerifyRegisterCode();

  const handleSendCode = useCallback(async () => {
    const emailValid = await trigger('email');
    if (!emailValid) return;

    const email = getValues('email')?.trim();
    if (!email) return;

    sendCode.mutate(email);
  }, [getValues, sendCode, trigger]);

  const onSubmit = handleSubmit(
    useCallback(
      async (values: RegisterProps) => {
        try {
          const verification = await verifyCode.mutateAsync(values.verification_code.trim());
          const registerToken = verification?.register_token || verification?.access_token;

          if (!registerToken || verification?.token_type !== 'Register') {
            toast.error(t('account.register.verify_failed_title', 'Verification Failed'), {
              description: t(
                'account.register.verify_failed_description',
                'The verification code is not valid for creating a new account.'
              )
            });
            return;
          }

          onRegisterAccount({
            username: values.username.trim(),
            display_name: values.username.trim(),
            email: values.email.trim(),
            password: values.password,
            confirm_password: values.confirm_password,
            register_token: registerToken
          });
        } catch (error) {
          toast.error(t('account.register.verify_failed_title', 'Verification Failed'), {
            description:
              error?.['data']?.message ||
              error?.['message'] ||
              t('account.register.verify_failed_description')
          });
        }
      },
      [onRegisterAccount, t, toast, verifyCode]
    )
  );

  const isSubmitting = isRegistering || verifyCode.isPending;

  return (
    <Page title={t('account.register.title')} layout={false}>
      <div className='fixed inset-0 bg-gradient-to-br from-red-50 via-primary-100 to-success-50 opacity-25' />
      <div className='absolute top-4 right-4'>
        <LanguageSwitcher />
      </div>
      <div className='relative flex flex-col items-center justify-center min-h-lvh z-10 px-4'>
        <div className='bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-xl'>
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
            <div className='-mt-4 flex justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={handleSendCode}
                disabled={sendCode.isPending}
                className='min-w-36'
              >
                {sendCode.isPending && (
                  <Icons name='IconLoader2' className='h-4 w-4 animate-spin' />
                )}
                {t('account.register.send_code', 'Send Code')}
              </Button>
            </div>
            <Controller
              name='verification_code'
              control={control}
              defaultValue=''
              rules={{
                required: t(
                  'account.register.verification_code_required',
                  'Verification code is required'
                ),
                validate: value => {
                  if (value && !/^[A-Za-z0-9]{4,12}$/.test(value.trim())) {
                    return t(
                      'account.register.verification_code_invalid',
                      'Enter a valid verification code'
                    );
                  }
                }
              }}
              render={({ field }) => (
                <InputField
                  label={t('account.register.verification_code', 'Verification code')}
                  placeholder={t(
                    'account.register.verification_code_placeholder',
                    'Enter the code from your email'
                  )}
                  error={errors.verification_code}
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
                  const issues = getPasswordPolicyIssues(value || '', passwordPolicy);
                  if (issues.length > 0) {
                    return passwordIssueMessage(issues[0], passwordPolicy.min_length, t);
                  } else if (value && value.length > 128) {
                    return t('fields.password.too_long', { count: 128 });
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
                disabled={isSubmitting}
              >
                {t('actions.already_have_an_account')}
                <strong>{t('actions.login')}</strong>
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting && <Icons name='IconLoader2' className='h-4 w-4 animate-spin' />}
                {t('actions.register')}
              </Button>
            </div>
          </Form>
        </div>
        <Footer />
      </div>
    </Page>
  );
};
