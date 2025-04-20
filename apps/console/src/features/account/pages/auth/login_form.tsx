import { useCallback } from 'react';

import { Button, CheckboxField, Form, InputField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
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

  if (!envName || isProd) {
    return null;
  }

  const username = 'super';
  const password = 'Ac123456';

  const handleLoginHintClick = () => {
    setValue('username', username);
    setValue('password', password);
    setValue('remember', true);
  };

  const classess = cn(
    'px-3.5 py-2 text-center rounded-xl text-slate-500',
    {
      'bg-warning-50': !isProd
    },
    { 'bg-red-50': isProd }
  );

  return (
    <div className={classess}>
      <Trans
        t={t}
        i18nKey='login_hint'
        values={{
          name: upperFirst(envName),
          credentials: `${username} / ${password}`
        }}
        components={{
          anchor: <Button variant='link' className='px-1' onClick={handleLoginHintClick} />
        }}
      />
    </div>
  );
};

export const LoginForm = ({
  onSuccess = () => undefined,
  hideForgetPassword = false,
  hideRegister = false
}: ExplicitAny & {
  onSuccess: () => void;
  hideForgetPassword?: boolean;
  hideRegister?: boolean;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<LoginProps>();

  const onError = error => {
    const { reason, message } = error?._data ?? ({} as ExplicitAny);
    // TODO: Notification
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const notificationProps = {
      title: reason,
      message: message || t(`componnets:errorPage.${reason?.toLowerCase() || 'unknown.label'}`),
      color: 'red',
      withCloseButton: false
    };
  };

  const { mutate: onLogin } = useLogin({
    onSuccess,
    onError
  });

  const onSubmit = handleSubmit(
    useCallback(async (values: LoginProps) => {
      onLogin(values);
    }, [])
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
        <Button
          variant='unstyle'
          className={cn(' text-slate-600 hover:text-primary-600/90 hover:bg-transparent -mr-3', {
            hidden: hideForgetPassword
          })}
          onClick={() => navigate('/forget-password')}
        >
          {t('actions.forgot_password')}
        </Button>
      </div>
      <LoginHint setValue={setValue} />
      <div className={cn('flex justify-between mt-2', { 'justify-end': hideRegister })}>
        <Button
          variant='unstyle'
          className={cn(
            'text-slate-400 hover:text-primary-600/90 hover:bg-transparent -ml-3 gap-x-2',
            {
              hidden: hideRegister
            }
          )}
          onClick={() => navigate('/register')}
        >
          {t('actions.need_account')}
          <strong>{t('actions.register')}</strong>
        </Button>
        <Button type='submit'>{t('actions.login')}</Button>
      </div>
    </Form>
  );
};
