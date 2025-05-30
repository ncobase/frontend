import { useCallback } from 'react';

import { Button, CheckboxField, Form, InputField } from '@ncobase/react';
import { cn, upperFirst } from '@ncobase/utils';
import { Controller, useForm, UseFormSetValue } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { LoginProps } from '../../account';

import { useLogin } from '@/features/account/service';

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

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<LoginProps>();

  const { mutate: onLogin } = useLogin({
    onSuccess,
    onError: error => {
      console.error('Login failed:', error);
      // Error handling is done in the hook
    }
  });

  const onSubmit = handleSubmit(
    useCallback(
      async (values: LoginProps) => {
        onLogin(values);
      },
      [onLogin]
    )
  );

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

        <Button type='submit'>{t('actions.login')}</Button>
      </div>
    </Form>
  );
};
