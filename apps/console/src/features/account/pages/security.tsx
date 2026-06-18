import { useMemo } from 'react';

import { Button, Container, Form, Icons, InputField, ScrollView } from '@ncobase/react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ChangePasswordPayload } from '../account';
import {
  getPasswordPolicyIssues,
  normalizePasswordPolicy,
  PasswordPolicyIssue
} from '../password_policy';
import { useChangePassword, usePasswordPolicy } from '../service';

import { AccountNavigation } from './components/account_navigation';

import { Page } from '@/components/layout';

const ruleKeys: PasswordPolicyIssue[] = [
  'min_length',
  'require_uppercase',
  'require_lowercase',
  'require_numbers',
  'require_symbols'
];

export const SecurityPage = () => {
  const { t } = useTranslation();
  const { data: loadedPolicy, isError: policyError } = usePasswordPolicy();
  const policy = normalizePasswordPolicy(loadedPolicy);

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
        </Container>
      </ScrollView>
    </Page>
  );
};
