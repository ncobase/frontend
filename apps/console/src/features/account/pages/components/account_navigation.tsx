import { Icons } from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

const accountTabs = [
  { to: '/account/profile', icon: 'IconUser', label: 'account.tabs.profile' },
  { to: '/account/security', icon: 'IconShieldCheck', label: 'account.tabs.security' },
  { to: '/account/sessions', icon: 'IconDevices', label: 'account.tabs.sessions' }
];

export const AccountNavigation = () => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('account.navigation.label', 'Account navigation')}
      className='flex flex-wrap gap-2 border-b border-slate-200 pb-3'
    >
      {accountTabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )
          }
        >
          <Icons name={tab.icon} className='h-4 w-4' />
          {t(tab.label)}
        </NavLink>
      ))}
    </nav>
  );
};
