import { Button, Form, InputField } from '@ncobase/react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Footer } from '@/components/footer/footer';
import { LanguageSwitcher } from '@/components/language_switcher';
import { Logo } from '@/components/logo';
import { Page } from '@/layout';
import { ForgetPasswordProps } from '@/types';

export const ForgetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    control,

    handleSubmit,
    formState: { errors }
  } = useForm<ForgetPasswordProps>();

  const onSubmit = formData => {
    console.log(formData);
  };

  return (
    <Page title={t('account.forget_password.title')} layout={false}>
      <div className='absolute top-4 right-4'>
        <LanguageSwitcher />
      </div>
      <div className='flex items-center justify-center flex-col min-h-lvh min-w-full'>
        <div className='p-6 bg-white shadow-sm max-w-2xl w-[38rem] -mt-14 rounded-md'>
          <div className='flex justify-center mb-3 mt-2'>
            <Logo type='full' height='2.25rem' />
          </div>
          <Form
            id='reset-password-init-form'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className='flex flex-col gap-y-6 mt-10 mb-5'
          >
            <Controller
              name='username_or_email'
              control={control}
              defaultValue=''
              rules={{
                required: t('fields.username_or_email.required'),
                validate: value => {
                  if (value && value.length < 6) {
                    return t('fields.username_or_email.too_short', { count: 6 });
                  } else if (value && value.length > 100) {
                    return t('fields.username_or_email.too_long', { count: 100 });
                  }
                }
              }}
              render={({ field }) => (
                <InputField
                  type='text'
                  name='username_or_email'
                  placeholder={t('fields.username_or_email.label')}
                  error={errors?.username_or_email}
                  {...field}
                />
              )}
            />

            <div className='flex justify-between mt-2'>
              <Button
                variant='unstyle'
                className='text-slate-400 hover:text-primary-600/90 hover:bg-transparent'
                onClick={() => navigate(-1)}
              >
                {t('actions.go_back')}
              </Button>
              <Button type='submit'>{t('actions.submit')}</Button>
            </div>
          </Form>
        </div>
        <Footer />
      </div>
    </Page>
  );
};
