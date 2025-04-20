import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ShellHeader, useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useMenus } from '../layout.hooks';
import { AccountDropdown, MainNavigation, TenantDropdown } from '../navigation';

import { LanguageSwitcher } from '@/components/language_switcher';
import { Logo } from '@/components/logo';
import { Notifications, NotificationItem } from '@/components/notifications/notification';
import { Preferences } from '@/components/preferences';
import { Search } from '@/components/search/search';
import { useQueryMenuTreeData } from '@/features/system/menu/service';

const HeaderComponent = ({ ...rest }) => {
  const { t } = useTranslation();
  const [menus, setMenus] = useMenus();
  const { data = [] } = useQueryMenuTreeData({});
  const toast = useToastMessage();
  const [pushEnabled, setPushEnabled] = useState(true);

  useEffect(() => {
    if (data?.length) {
      setMenus(data);
    }
  }, [data, setMenus]);

  const headerMenus = useMemo(() => menus.filter(menu => menu.type === 'header'), [menus]);

  const notifications = useMemo<NotificationItem[]>(
    () => [
      {
        id: '1',
        title: '您有个待办需要处理。',
        description: t('datetime.now'),
        type: 'info',
        read: false
      },
      {
        id: '2',
        title: '您有一条新信息！',
        description: t('datetime.minutes_ago_with_value', { minutes: 5 }),
        type: 'success',
        read: false
      },
      {
        id: '3',
        title: '您的订阅即将到期！',
        description: t('datetime.days_ago_with_value', { days: 2 }),
        type: 'warning',
        read: false
      }
    ],
    [t]
  );

  const handleMarkAllAsRead = useCallback(() => {
    // Show a toast when marking all as read
    toast.success(t('notification.marked_all_as_read'), {
      description: t('notification.marked_all_as_read_description')
    });
  }, [t, toast]);

  const handleTogglePushSettings = useCallback(
    (enabled: boolean) => {
      setPushEnabled(enabled);

      // Show a toast when changing push settings
      if (enabled) {
        toast.info(t('notification.push_notifications_enabled'));
      } else {
        toast.info(t('notification.push_notifications_disabled'));
      }
    },
    [t, toast]
  );

  return (
    <ShellHeader
      className='flex items-center justify-between bg-gradient-to-r border-b-0 backdrop-blur from-slate-800 via-slate-700 via-20% to-slate-800'
      {...rest}
    >
      <div className='inline-flex items-center justify-start'>
        <Logo className='w-14 h-14 bg-slate-900' type='min' height='2.625rem' color='white' />
        {headerMenus.length > 0 && <MainNavigation menus={headerMenus} />}
      </div>
      <div className='inline-flex items-center px-4 gap-x-3'>
        <Search />
        <LanguageSwitcher />
        <Preferences />
        <Notifications
          items={notifications}
          onMarkAllAsRead={handleMarkAllAsRead}
          onTogglePushSettings={handleTogglePushSettings}
          pushEnabled={pushEnabled}
        />
        <TenantDropdown />
        <AccountDropdown />
      </div>
    </ShellHeader>
  );
};

export const Header = React.memo(HeaderComponent);
