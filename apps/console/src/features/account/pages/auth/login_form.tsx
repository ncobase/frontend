import { useCallback, useState } from 'react';

import { Button, CheckboxField, Form, Icons, InputField } from '@ncobase/react';
import { cn, upperFirst } from '@ncobase/utils';
import { Controller, useForm, UseFormSetValue } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { LoginProps, MFALoginPayload, LoginReply } from '../../account';

import { useLogin, useLoginMFA } from '@/features/account/service';

interface LoginHintProps {
  setValue: UseFormSetValue<LoginProps>;
}

const LoginHint = ({ setValue }: LoginHintProps) => {
  const { t } = useTranslation();
  const isProd = import.meta.env.PROD;
  const envName = !isProd && import.meta.env.MODE;

  if (!envName || isProd) return null;

  const handleLoginHintClick = () => {
    setValue('username', 'super');
    setValue('password', 'Super123456');
    setValue('remember', true);
  };

  return (
    <div className={cn('px-3.5 py-2 text-center rounded-xl text-slate-500', 'bg-warning-50')}>
      <Trans
        t={t}
        i18nKey='login_hint'
        values={{ name: upperFirst(envName) }}
        components={{
          anchor: <Button variant='link' className='px-1' onClick={handleLoginHintClick} />
        }}
      />
    </div>
  );
};

interface LoginFormProps {
  onSuccess?: () => void;
  hideForgetPassword?: boolean;
  hideRegister?: boolean;
}

export const LoginForm = ({
  onSuccess = () => undefined,
  hideForgetPassword = false,
  hideRegister = false
}: LoginFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mfaChallenge, setMfaChallenge] = useState<LoginReply | null>(null);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<LoginProps>();

  const mfaForm = useForm<MFALoginPayload>({
    defaultValues: {
      mfa_token: '',
      code: '',
      recovery_code: ''
    }
  });

  const { mutate: onLogin, isPending: isLoggingIn } = useLogin({
    onSuccess,
    onMFA: challenge => {
      setMfaChallenge(challenge);
      mfaForm.reset({
        mfa_token: challenge.mfa_token || '',
        code: '',
        recovery_code: ''
      });
    },
    onError: error => {
      console.error('Login failed:', error);
      // Error handling is done in the hook
    }
  });
  const verifyMFA = useLoginMFA({
    onSuccess
  });

  const onSubmit = handleSubmit(
    useCallback(
      async (values: LoginProps) => {
        onLogin(values);
      },
      [onLogin]
    )
  );

  const onMFASubmit = mfaForm.handleSubmit(values => {
    verifyMFA.mutate({
      mfa_token: mfaChallenge?.mfa_token || values.mfa_token,
      code: useRecoveryCode ? undefined : values.code?.trim(),
      recovery_code: useRecoveryCode ? values.recovery_code?.trim() : undefined
    });
  });

  if (mfaChallenge?.mfa_required) {
    return (
      <Form
        id='login-mfa-form'
        onSubmit={onMFASubmit}
        noValidate
        className='flex flex-col gap-y-6 mt-6'
      >
        <div className='rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-800'>
          <div className='flex items-start gap-2'>
            <Icons name='IconShieldCheck' className='mt-0.5 h-4 w-4' />
            <div>
              <div className='font-medium'>
                {t('account.mfa.login_required_title', 'Two-Factor Authentication Required')}
              </div>
              <div className='mt-1 text-primary-700'>
                {t(
                  'account.mfa.login_required_description',
                  'Enter an authenticator code or a recovery code to finish signing in.'
                )}
              </div>
            </div>
          </div>
        </div>

        {!useRecoveryCode ? (
          <Controller
            name='code'
            control={mfaForm.control}
            rules={{
              required: t('account.mfa.code_required', 'Authenticator code is required'),
              validate: value => {
                if (value && !/^[0-9]{6}$/.test(value.trim())) {
                  return t('account.mfa.code_invalid', 'Enter the 6-digit authenticator code');
                }
              }
            }}
            render={({ field }) => (
              <InputField
                label={t('account.mfa.code', 'Authenticator code')}
                placeholder='123456'
                inputMode='numeric'
                autoComplete='one-time-code'
                error={mfaForm.formState.errors.code}
                disabled={verifyMFA.isPending}
                {...field}
              />
            )}
          />
        ) : (
          <Controller
            name='recovery_code'
            control={mfaForm.control}
            rules={{
              required: t('account.mfa.recovery_code_required', 'Recovery code is required')
            }}
            render={({ field }) => (
              <InputField
                label={t('account.mfa.recovery_code', 'Recovery code')}
                placeholder='ABCDE-FGHIJ'
                autoComplete='one-time-code'
                error={mfaForm.formState.errors.recovery_code}
                disabled={verifyMFA.isPending}
                {...field}
              />
            )}
          />
        )}

        <div className='flex flex-wrap items-center justify-between gap-3'>
          <Button
            type='button'
            variant='unstyle'
            className='text-slate-600 hover:text-primary-600/90 hover:bg-transparent'
            onClick={() => setUseRecoveryCode(value => !value)}
            disabled={verifyMFA.isPending}
          >
            {useRecoveryCode
              ? t('account.mfa.use_authenticator_code', 'Use authenticator code')
              : t('account.mfa.use_recovery_code', 'Use recovery code')}
          </Button>

          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setMfaChallenge(null);
                setUseRecoveryCode(false);
                mfaForm.reset();
              }}
              disabled={verifyMFA.isPending}
            >
              {t('actions.go_back')}
            </Button>
            <Button type='submit' disabled={verifyMFA.isPending}>
              {verifyMFA.isPending && <Icons name='IconLoader2' className='h-4 w-4 animate-spin' />}
              {t('account.mfa.verify_login', 'Verify and sign in')}
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  return (
    <Form id='login-form' onSubmit={onSubmit} noValidate className='flex flex-col gap-y-6 mt-6'>
      <Controller
        name='username'
        control={control}
        rules={{ required: t('fields.username.required') }}
        defaultValue=''
        render={({ field }) => (
          <InputField
            error={errors.username}
            label={t('fields.username.label')}
            placeholder={t('fields.username.placeholder')}
            {...field}
          />
        )}
      />

      <Controller
        name='password'
        control={control}
        rules={{ required: t('fields.password.required') }}
        defaultValue=''
        render={({ field }) => (
          <InputField
            type='password'
            error={errors.password}
            label={t('fields.password.label')}
            placeholder={t('fields.password.placeholder')}
            {...field}
          />
        )}
      />

      <div className='flex items-center gap-x-4 justify-between'>
        <Controller
          name='remember'
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <CheckboxField
              error={errors.remember}
              checked={field.value}
              label={t('fields.remember.label')}
              {...field}
            />
          )}
        />

        {!hideForgetPassword && (
          <Button
            variant='unstyle'
            className='text-slate-600 hover:text-primary-600/90 hover:bg-transparent -mr-3'
            onClick={() => navigate('/forget-password')}
          >
            {t('actions.forgot_password')}
          </Button>
        )}
      </div>

      <LoginHint setValue={setValue} />

      <div className={cn('flex justify-between mt-2', { 'justify-end': hideRegister })}>
        {!hideRegister && (
          <Button
            variant='unstyle'
            className='text-slate-400 hover:text-primary-600/90 hover:bg-transparent -ml-3 gap-x-2'
            onClick={() => navigate('/register')}
          >
            {t('actions.need_account')}
            <strong>{t('actions.register')}</strong>
          </Button>
        )}

        <Button type='submit' disabled={isLoggingIn}>
          {isLoggingIn && <Icons name='IconLoader2' className='h-4 w-4 animate-spin' />}
          {t('actions.login')}
        </Button>
      </div>
    </Form>
  );
};
