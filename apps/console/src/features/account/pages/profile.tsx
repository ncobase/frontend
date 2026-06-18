import { Button, Container, Icons, ScrollView } from '@ncobase/react';
import { formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { AccountNavigation } from './components/account_navigation';

import { AvatarButton } from '@/components/avatar/avatar_button';
import { Page } from '@/components/layout';
import { useAccount } from '@/features/account/service';

const formatOptionalDate = (value?: number) => {
  if (!value) return '-';
  return formatRelativeTime(new Date(value));
};

const joinName = (first?: string, last?: string) => {
  return [first, last].filter(Boolean).join(' ');
};

export const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    user,
    profile,
    roles = [],
    spaces = [],
    permissions = [],
    isLoading,
    error
  } = useAccount();

  const displayName =
    profile?.display_name ||
    joinName(profile?.first_name, profile?.last_name) ||
    user?.username ||
    '-';
  const fullName = joinName(profile?.first_name, profile?.last_name) || '-';

  if (isLoading) {
    return (
      <Page title={t('account.profile.title', 'Profile')}>
        <Container className='max-w-4xl py-12'>
          <div className='flex items-center justify-center text-slate-500'>
            <Icons name='IconLoader2' className='h-5 w-5 animate-spin' />
            <span className='ml-2'>{t('common.loading', 'Loading')}</span>
          </div>
        </Container>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title={t('account.profile.title', 'Profile')}>
        <Container className='max-w-4xl py-12'>
          <div className='rounded-lg border border-red-200 bg-red-50 p-5 text-red-700'>
            {t('account.profile.load_error', 'Failed to load account profile.')}
          </div>
        </Container>
      </Page>
    );
  }

  return (
    <Page title={t('account.profile.title', 'Profile')} className='p-0'>
      <ScrollView className='py-6'>
        <Container className='max-w-4xl space-y-6'>
          <AccountNavigation />

          <section className='rounded-lg border border-slate-200 bg-white p-5 shadow-xs'>
            <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-4'>
                <AvatarButton
                  isLoading={isLoading}
                  className='h-20 w-20 rounded-md'
                  src={profile?.thumbnail}
                  title={displayName}
                  alt={displayName}
                />
                <div className='min-w-0'>
                  <h1 className='truncate text-2xl font-semibold text-slate-900'>{displayName}</h1>
                  <div className='mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600'>
                    {user?.email && (
                      <span className='inline-flex items-center gap-1'>
                        <Icons name='IconAt' className='h-4 w-4 text-slate-400' />
                        {user.email}
                      </span>
                    )}
                    {user?.phone && (
                      <span className='inline-flex items-center gap-1'>
                        <Icons name='IconPhone' className='h-4 w-4 text-slate-400' />
                        {user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Button variant='outline' onClick={() => navigate('/account/security')}>
                <Icons name='IconShieldCheck' className='h-4 w-4' />
                {t('account.profile.manage_security', 'Manage Security')}
              </Button>
            </div>
          </section>

          <section className='grid gap-4 sm:grid-cols-3'>
            <SummaryItem
              icon='IconUsersGroup'
              label={t('account.profile.roles', 'Roles')}
              value={roles.length}
            />
            <SummaryItem
              icon='IconBuilding'
              label={t('account.profile.spaces', 'Spaces')}
              value={spaces.length}
            />
            <SummaryItem
              icon='IconKey'
              label={t('account.profile.permissions', 'Permissions')}
              value={permissions.length}
            />
          </section>

          <section className='rounded-lg border border-slate-200 bg-white p-5 shadow-xs'>
            <h2 className='text-base font-semibold text-slate-900'>
              {t('account.profile.account_information', 'Account information')}
            </h2>
            <dl className='mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2'>
              <ProfileField label={t('fields.username.label')} value={user?.username} />
              <ProfileField label={t('common.email')} value={user?.email} />
              <ProfileField label={t('common.phone', 'Phone')} value={user?.phone} />
              <ProfileField
                label={t('common.status')}
                value={user?.status === 0 ? t('common.active') : t('common.disabled')}
              />
              <ProfileField
                label={t('profile.fields.display_name', 'Display Name')}
                value={displayName}
              />
              <ProfileField label={t('profile.fields.full_name', 'Full Name')} value={fullName} />
              <ProfileField label={t('profile.fields.title', 'Title')} value={profile?.title} />
              <ProfileField
                label={t('common.created.at')}
                value={formatOptionalDate(user?.created_at)}
              />
              <ProfileField
                className='sm:col-span-2'
                label={t('profile.fields.short_bio', 'Short Bio')}
                value={profile?.short_bio}
              />
              <ProfileField
                className='sm:col-span-2'
                label={t('profile.fields.about', 'About')}
                value={profile?.about}
              />
            </dl>
          </section>
        </Container>
      </ScrollView>
    </Page>
  );
};

const SummaryItem = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
  <div className='rounded-lg border border-slate-200 bg-white p-4 shadow-xs'>
    <div className='flex items-center gap-3'>
      <div className='rounded-md bg-slate-100 p-2'>
        <Icons name={icon} className='h-5 w-5 text-slate-600' />
      </div>
      <div>
        <div className='text-2xl font-semibold text-slate-900'>{value}</div>
        <div className='text-sm text-slate-500'>{label}</div>
      </div>
    </div>
  </div>
);

const ProfileField = ({
  label,
  value,
  className
}: {
  label: string;
  value?: string | number;
  className?: string;
}) => (
  <div className={className}>
    <dt className='text-sm font-medium text-slate-500'>{label}</dt>
    <dd className='mt-1 min-h-6 break-words border-b border-slate-100 pb-2 text-sm text-slate-900'>
      {value || '-'}
    </dd>
  </div>
);
