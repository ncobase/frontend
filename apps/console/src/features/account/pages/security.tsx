import { useMemo, useState } from 'react';

import {
  Button,
  Container,
  Form,
  Icons,
  InputField,
  ScrollView,
  useToastMessage
} from '@ncobase/react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ChangePasswordPayload, RecoveryCodesReply, TwoFactorSetupReply } from '../account';
import {
  getPasswordPolicyIssues,
  normalizePasswordPolicy,
  PasswordPolicyIssue
} from '../password_policy';
import {
  useChangePassword,
  useDisableTwoFactor,
  usePasswordPolicy,
  useRegenerateRecoveryCodes,
  useSetupTwoFactor,
  useTwoFactorStatus,
  useVerifyTwoFactor
} from '../service';

import { AccountNavigation } from './components/account_navigation';

import { Page } from '@/components/layout';

const ruleKeys: PasswordPolicyIssue[] = [
  'min_length',
  'require_uppercase',
  'require_lowercase',
  'require_numbers',
  'require_symbols'
];

type TwoFactorCodeForm = {
  code: string;
};

type TwoFactorDisableForm = {
  password: string;
  code: string;
  recovery_code: string;
};

export const SecurityPage = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const { data: loadedPolicy, isError: policyError } = usePasswordPolicy();
  const twoFactor = useTwoFactorStatus();
  const policy = normalizePasswordPolicy(loadedPolicy);
  const [setupData, setSetupData] = useState<TwoFactorSetupReply | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm<ChangePasswordPayload>({
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm: ''
    }
  });

  const newPassword = watch('new_password') || '';
  const oldPassword = watch('old_password') || '';
  const policyIssues = useMemo(
    () => getPasswordPolicyIssues(newPassword, policy),
    [newPassword, policy]
  );

  const changePassword = useChangePassword({
    onSuccess: () => reset()
  });
  const setupCodeForm = useForm<TwoFactorCodeForm>({
    defaultValues: { code: '' }
  });
  const regenerateCodeForm = useForm<TwoFactorCodeForm>({
    defaultValues: { code: '' }
  });
  const disableForm = useForm<TwoFactorDisableForm>({
    defaultValues: {
      password: '',
      code: '',
      recovery_code: ''
    }
  });
  const setupTwoFactor = useSetupTwoFactor({
    onSuccess: data => {
      setSetupData(data);
      setRecoveryCodes([]);
      setupCodeForm.reset({ code: '' });
    }
  });
  const verifyTwoFactor = useVerifyTwoFactor({
    onSuccess: (data: RecoveryCodesReply) => {
      setSetupData(null);
      setRecoveryCodes(data.recovery_codes || []);
      setupCodeForm.reset({ code: '' });
    }
  });
  const disableTwoFactor = useDisableTwoFactor({
    onSuccess: () => {
      setSetupData(null);
      setRecoveryCodes([]);
      disableForm.reset();
    }
  });
  const regenerateRecoveryCodes = useRegenerateRecoveryCodes({
    onSuccess: (data: RecoveryCodesReply) => {
      setRecoveryCodes(data.recovery_codes || []);
      regenerateCodeForm.reset({ code: '' });
    }
  });

  const copyRecoveryCodes = async () => {
    if (recoveryCodes.length === 0) return;
    try {
      await navigator.clipboard.writeText(recoveryCodes.join('\n'));
      toast.success(t('account.mfa.recovery_copied_title', 'Recovery Codes Copied'), {
        description: t(
          'account.mfa.recovery_copied_description',
          'The recovery codes were copied to your clipboard.'
        )
      });
    } catch {
      toast.error(t('account.mfa.recovery_copy_failed_title', 'Copy Failed'), {
        description: t(
          'account.mfa.recovery_copy_failed_description',
          'Copy the recovery codes manually.'
        )
      });
    }
  };

  const passwordRuleMessage = (issue: PasswordPolicyIssue) => {
    switch (issue) {
      case 'min_length':
        return t('account.security.rules.min_length', {
          count: policy.min_length,
          defaultValue: `At least ${policy.min_length} characters`
        });
      case 'require_uppercase':
        return t('account.security.rules.require_uppercase', 'Contains an uppercase letter');
      case 'require_lowercase':
        return t('account.security.rules.require_lowercase', 'Contains a lowercase letter');
      case 'require_numbers':
        return t('account.security.rules.require_numbers', 'Contains a number');
      case 'require_symbols':
        return t('account.security.rules.require_symbols', 'Contains a symbol');
      default:
        return issue;
    }
  };

  const visibleRules = ruleKeys.filter(rule => {
    if (rule === 'min_length') return true;
    return policy[rule];
  });

  const onSubmit = handleSubmit(values => {
    changePassword.mutate(values);
  });
  const onSetupVerifySubmit = setupCodeForm.handleSubmit(values => {
    verifyTwoFactor.mutate({ method: 'app', code: values.code.trim() });
  });
  const onRegenerateSubmit = regenerateCodeForm.handleSubmit(values => {
    regenerateRecoveryCodes.mutate({ method: 'app', code: values.code.trim() });
  });
  const onDisableSubmit = disableForm.handleSubmit(values => {
    disableTwoFactor.mutate({
      password: values.password,
      code: values.code?.trim() || undefined,
      recovery_code: values.recovery_code?.trim() || undefined
    });
  });

  return (
    <Page title={t('account.security.title', 'Account Security')}>
      <ScrollView className='py-6'>
        <Container className='max-w-4xl space-y-6'>
          <AccountNavigation />

          <section className='space-y-2'>
            <h1 className='text-2xl font-semibold text-slate-900'>
              {t('account.security.title', 'Account Security')}
            </h1>
            <p className='text-sm text-slate-600'>
              {t(
                'account.security.description',
                'Change your password and review the requirements enforced by the backend.'
              )}
            </p>
          </section>

          {policyError && (
            <div className='rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
              {t(
                'account.security.policy_fallback',
                'Password policy could not be loaded. The default policy is shown.'
              )}
            </div>
          )}

          <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]'>
            <Form
              id='account-password-form'
              noValidate
              onSubmit={onSubmit}
              className='rounded-lg border border-slate-200 bg-white p-5 shadow-xs'
            >
              <div className='space-y-5'>
                <Controller
                  name='old_password'
                  control={control}
                  rules={{ required: t('account.security.current_password_required') }}
                  render={({ field }) => (
                    <InputField
                      type='password'
                      autoComplete='current-password'
                      label={t('account.security.current_password', 'Current password')}
                      placeholder={t(
                        'account.security.current_password_placeholder',
                        'Enter your current password'
                      )}
                      error={errors.old_password}
                      disabled={changePassword.isPending}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name='new_password'
                  control={control}
                  rules={{
                    required: t('fields.password.required'),
                    validate: value => {
                      const issues = getPasswordPolicyIssues(value || '', policy);
                      if (issues.length > 0) {
                        return passwordRuleMessage(issues[0]);
                      }
                      if (value === oldPassword) {
                        return t(
                          'account.security.new_password_same',
                          'New password must be different from the current password.'
                        );
                      }
                    }
                  }}
                  render={({ field }) => (
                    <InputField
                      type='password'
                      autoComplete='new-password'
                      label={t('account.security.new_password', 'New password')}
                      placeholder={t(
                        'account.security.new_password_placeholder',
                        'Enter a new password'
                      )}
                      error={errors.new_password}
                      disabled={changePassword.isPending}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name='confirm'
                  control={control}
                  rules={{
                    required: t('fields.confirm_password.required'),
                    validate: value => {
                      if (value !== newPassword) {
                        return t('fields.confirm_password.mismatch');
                      }
                    }
                  }}
                  render={({ field }) => (
                    <InputField
                      type='password'
                      autoComplete='new-password'
                      label={t('account.security.confirm_password', 'Confirm new password')}
                      placeholder={t(
                        'account.security.confirm_password_placeholder',
                        'Re-enter the new password'
                      )}
                      error={errors.confirm}
                      disabled={changePassword.isPending}
                      {...field}
                    />
                  )}
                />

                <div className='flex justify-end'>
                  <Button
                    type='submit'
                    disabled={!isDirty || changePassword.isPending}
                    className='min-w-36'
                  >
                    {changePassword.isPending && (
                      <Icons name='IconLoader2' className='h-4 w-4 animate-spin' />
                    )}
                    {t('account.security.update_password', 'Update Password')}
                  </Button>
                </div>
              </div>
            </Form>

            <aside className='rounded-lg border border-slate-200 bg-white p-5 shadow-xs'>
              <h2 className='text-sm font-semibold text-slate-900'>
                {t('account.security.password_requirements', 'Password requirements')}
              </h2>
              <ul className='mt-4 space-y-3'>
                {visibleRules.map(rule => {
                  const satisfied = newPassword ? !policyIssues.includes(rule) : false;
                  return (
                    <li key={rule} className='flex items-start gap-2 text-sm'>
                      <Icons
                        name={satisfied ? 'IconCircleCheck' : 'IconCircle'}
                        className={
                          satisfied
                            ? 'mt-0.5 h-4 w-4 text-success-600'
                            : 'mt-0.5 h-4 w-4 text-slate-400'
                        }
                      />
                      <span className={satisfied ? 'text-slate-800' : 'text-slate-500'}>
                        {passwordRuleMessage(rule)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>

          <section className='rounded-lg border border-slate-200 bg-white p-5 shadow-xs'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <h2 className='text-base font-semibold text-slate-900'>
                  {t('account.mfa.title', 'Two-Factor Authentication')}
                </h2>
                <p className='mt-1 text-sm text-slate-600'>
                  {t(
                    'account.mfa.description',
                    'Require an authenticator code or recovery code after password login.'
                  )}
                </p>
              </div>
              <span
                className={
                  twoFactor.data?.enabled
                    ? 'inline-flex rounded-full bg-success-50 px-3 py-1 text-sm font-medium text-success-700'
                    : 'inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600'
                }
              >
                {twoFactor.data?.enabled
                  ? t('account.mfa.enabled', 'Enabled')
                  : t('account.mfa.disabled', 'Disabled')}
              </span>
            </div>

            {twoFactor.isLoading && (
              <div className='mt-5 flex items-center gap-2 text-sm text-slate-500'>
                <Icons name='IconLoader2' className='h-4 w-4 animate-spin' />
                {t('common.loading', 'Loading')}
              </div>
            )}

            {twoFactor.isError && (
              <div className='mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                <div>{t('account.mfa.status_error', 'Failed to load 2FA status.')}</div>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  className='mt-3'
                  onClick={() => twoFactor.refetch()}
                >
                  {t('actions.retry', 'Retry')}
                </Button>
              </div>
            )}

            {!twoFactor.isLoading && !twoFactor.isError && !twoFactor.data?.enabled && (
              <div className='mt-5 space-y-5'>
                {!setupData ? (
                  <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='text-sm text-slate-600'>
                      {t(
                        'account.mfa.disabled_description',
                        'Set up an authenticator app before enabling 2FA.'
                      )}
                    </div>
                    <Button
                      type='button'
                      onClick={() => setupTwoFactor.mutate()}
                      disabled={setupTwoFactor.isPending}
                    >
                      {setupTwoFactor.isPending && (
                        <Icons name='IconLoader2' className='h-4 w-4 animate-spin' />
                      )}
                      {t('account.mfa.start_setup', 'Start setup')}
                    </Button>
                  </div>
                ) : (
                  <div className='grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]'>
                    <div className='rounded-md border border-slate-200 bg-slate-50 p-4'>
                      {setupData.qr_png ? (
                        <img
                          src={`data:image/png;base64,${setupData.qr_png}`}
                          alt={t('account.mfa.qr_alt', 'Authenticator setup QR code')}
                          className='mx-auto h-44 w-44 rounded bg-white p-2'
                        />
                      ) : (
                        <div className='flex h-44 w-full items-center justify-center text-sm text-slate-500'>
                          {t('account.mfa.qr_unavailable', 'QR code unavailable')}
                        </div>
                      )}
                    </div>
                    <div className='space-y-5'>
                      <div>
                        <div className='text-sm font-medium text-slate-700'>
                          {t('account.mfa.secret', 'Setup secret')}
                        </div>
                        <div className='mt-2 break-all rounded-md bg-slate-100 px-3 py-2 font-mono text-sm text-slate-800'>
                          {setupData.secret}
                        </div>
                      </div>
                      <Form id='account-2fa-verify-form' onSubmit={onSetupVerifySubmit} noValidate>
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
                          <Controller
                            name='code'
                            control={setupCodeForm.control}
                            rules={{
                              required: t('account.mfa.code_required'),
                              validate: value => {
                                if (value && !/^[0-9]{6}$/.test(value.trim())) {
                                  return t('account.mfa.code_invalid');
                                }
                              }
                            }}
                            render={({ field }) => (
                              <InputField
                                label={t('account.mfa.code', 'Authenticator code')}
                                placeholder='123456'
                                inputMode='numeric'
                                autoComplete='one-time-code'
                                error={setupCodeForm.formState.errors.code}
                                disabled={verifyTwoFactor.isPending}
                                {...field}
                              />
                            )}
                          />
                          <div className='flex gap-2'>
                            <Button
                              type='button'
                              variant='outline'
                              onClick={() => {
                                setSetupData(null);
                                setupCodeForm.reset({ code: '' });
                              }}
                              disabled={verifyTwoFactor.isPending}
                            >
                              {t('actions.cancel')}
                            </Button>
                            <Button type='submit' disabled={verifyTwoFactor.isPending}>
                              {verifyTwoFactor.isPending && (
                                <Icons name='IconLoader2' className='h-4 w-4 animate-spin' />
                              )}
                              {t('account.mfa.enable', 'Enable 2FA')}
                            </Button>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!twoFactor.isLoading && !twoFactor.isError && twoFactor.data?.enabled && (
              <div className='mt-5 grid gap-6 lg:grid-cols-2'>
                <div className='space-y-5'>
                  <div className='rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700'>
                    <div className='font-medium text-slate-900'>
                      {t('account.mfa.current_method', 'Current method')}
                    </div>
                    <div className='mt-1'>
                      {twoFactor.data.method ||
                        t('account.mfa.authenticator_app', 'Authenticator app')}
                    </div>
                    <div className='mt-4 font-medium text-slate-900'>
                      {t('account.mfa.recovery_remaining', 'Recovery codes remaining')}
                    </div>
                    <div className='mt-1'>{twoFactor.data.recovery_codes_remaining ?? 0}</div>
                  </div>

                  <Form id='account-2fa-regenerate-form' onSubmit={onRegenerateSubmit} noValidate>
                    <div className='space-y-3'>
                      <Controller
                        name='code'
                        control={regenerateCodeForm.control}
                        rules={{
                          required: t('account.mfa.code_required'),
                          validate: value => {
                            if (value && !/^[0-9]{6}$/.test(value.trim())) {
                              return t('account.mfa.code_invalid');
                            }
                          }
                        }}
                        render={({ field }) => (
                          <InputField
                            label={t(
                              'account.mfa.regenerate_code',
                              'Authenticator code for new recovery codes'
                            )}
                            placeholder='123456'
                            inputMode='numeric'
                            autoComplete='one-time-code'
                            error={regenerateCodeForm.formState.errors.code}
                            disabled={regenerateRecoveryCodes.isPending}
                            {...field}
                          />
                        )}
                      />
                      <Button type='submit' disabled={regenerateRecoveryCodes.isPending}>
                        {regenerateRecoveryCodes.isPending && (
                          <Icons name='IconLoader2' className='h-4 w-4 animate-spin' />
                        )}
                        {t('account.mfa.regenerate_recovery_codes', 'Regenerate recovery codes')}
                      </Button>
                    </div>
                  </Form>
                </div>

                <Form id='account-2fa-disable-form' onSubmit={onDisableSubmit} noValidate>
                  <div className='space-y-4 rounded-md border border-red-200 bg-red-50 p-4'>
                    <div>
                      <h3 className='text-sm font-semibold text-red-800'>
                        {t('account.mfa.disable_title', 'Disable 2FA')}
                      </h3>
                      <p className='mt-1 text-sm text-red-700'>
                        {t(
                          'account.mfa.disable_description',
                          'Confirm your password and an authenticator or recovery code.'
                        )}
                      </p>
                    </div>
                    <Controller
                      name='password'
                      control={disableForm.control}
                      rules={{ required: t('account.security.current_password_required') }}
                      render={({ field }) => (
                        <InputField
                          type='password'
                          autoComplete='current-password'
                          label={t('account.security.current_password', 'Current password')}
                          error={disableForm.formState.errors.password}
                          disabled={disableTwoFactor.isPending}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name='code'
                      control={disableForm.control}
                      render={({ field }) => (
                        <InputField
                          label={t('account.mfa.code', 'Authenticator code')}
                          placeholder='123456'
                          inputMode='numeric'
                          autoComplete='one-time-code'
                          error={disableForm.formState.errors.code}
                          disabled={disableTwoFactor.isPending}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name='recovery_code'
                      control={disableForm.control}
                      render={({ field }) => (
                        <InputField
                          label={t('account.mfa.recovery_code', 'Recovery code')}
                          placeholder='ABCDE-FGHIJ'
                          autoComplete='one-time-code'
                          error={disableForm.formState.errors.recovery_code}
                          disabled={disableTwoFactor.isPending}
                          {...field}
                        />
                      )}
                    />
                    <Button type='submit' variant='danger' disabled={disableTwoFactor.isPending}>
                      {disableTwoFactor.isPending && (
                        <Icons name='IconLoader2' className='h-4 w-4 animate-spin' />
                      )}
                      {t('account.mfa.disable', 'Disable 2FA')}
                    </Button>
                  </div>
                </Form>
              </div>
            )}

            {recoveryCodes.length > 0 && (
              <div className='mt-6 rounded-md border border-amber-200 bg-amber-50 p-4'>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                  <div>
                    <h3 className='text-sm font-semibold text-amber-900'>
                      {t('account.mfa.recovery_codes_title', 'Store these recovery codes')}
                    </h3>
                    <p className='mt-1 text-sm text-amber-800'>
                      {t(
                        'account.mfa.recovery_codes_description',
                        'Each code can be used once if you lose access to your authenticator app.'
                      )}
                    </p>
                  </div>
                  <Button type='button' variant='outline' onClick={copyRecoveryCodes}>
                    <Icons name='IconCopy' className='h-4 w-4' />
                    {t('actions.copy', 'Copy')}
                  </Button>
                </div>
                <div className='mt-4 grid gap-2 sm:grid-cols-2'>
                  {recoveryCodes.map(code => (
                    <code
                      key={code}
                      className='rounded bg-white px-3 py-2 font-mono text-sm text-slate-800'
                    >
                      {code}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </section>
        </Container>
      </ScrollView>
    </Page>
  );
};
