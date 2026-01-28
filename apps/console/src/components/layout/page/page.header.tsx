import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Icons, useToastMessage, ShellHeader } from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useNavigationMenus } from '../layout.hooks';
import { AccountDropdown, MainNavigation, SpaceDropdown } from '../navigation';

import { LanguageSwitcher } from '@/components/language_switcher';
import { Logo } from '@/components/logo';
import { Notifications, NotificationItem } from '@/components/notifications/notification';
import { Preferences } from '@/components/preferences';
import { Search } from '@/components/search/search';
import { useMenuPermissions } from '@/features/account/permissions';
import { useQueryNavigationMenus } from '@/features/system/menu/service';

interface HeaderComponentProps {
  onMobileMenuToggle?: () => void;
  showMobileMenuButton?: boolean;
}

const HeaderComponent = ({
  onMobileMenuToggle,
  showMobileMenuButton,
  ...rest
}: HeaderComponentProps) => {
  const { t } = useTranslation();
  const [navigationMenus, setNavigationMenus] = useNavigationMenus();
  const { data: menuTreeData, isLoading, error } = useQueryNavigationMenus();
  const toast = useToastMessage();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [isMenusSet, setIsMenusSet] = useState(false);

  const { filterMenuTree, canAccessMenu } = useMenuPermissions();

  useEffect(() => {
    if (menuTreeData && typeof menuTreeData === 'object' && !isMenusSet) {
      try {
        const filteredGroups = {
          headers: filterMenuTree(menuTreeData.headers || []),
          sidebars: filterMenuTree(menuTreeData.sidebars || []),
          accounts: filterMenuTree(menuTreeData.accounts || []),
          spaces: filterMenuTree(menuTreeData.spaces || [])
        };

        setNavigationMenus(filteredGroups);
        setIsMenusSet(true);
      } catch (filterError) {
        console.error('Error applying menu permissions:', filterError);
        toast.error(t('menu.permission_filter_error', 'Failed to apply menu permissions'));
        setIsMenusSet(true);
      }
    }

    if (error && !isMenusSet) {
      console.error('Failed to load menu data:', error);
      toast.error(t('menu.load_error', 'Failed to load navigation menu'));
      setIsMenusSet(true);
    }
  }, [menuTreeData, error, setNavigationMenus, toast, t, isMenusSet, filterMenuTree]);

  useEffect(() => {
    if (!menuTreeData && !isLoading) {
      setIsMenusSet(false);
    }
  }, [menuTreeData, isLoading]);

  const headerMenus = useMemo(() => {
    if (!navigationMenus.headers) return [];
    return navigationMenus.headers.filter(
      menu => !menu.hidden && !menu.disabled && canAccessMenu(menu)
    );
  }, [navigationMenus.headers, canAccessMenu]);

  const notifications = useMemo<NotificationItem[]>(
    () => [
      {
        id: '1',
        title: 'You have a task to handle.',
        description: t('datetime.now'),
        type: 'info',
        read: false
      },
      {
        id: '2',
        title: 'You have a new message!',
        description: t('datetime.minutes_ago_with_value', { minutes: 5 }),
        type: 'success',
        read: false
      },
      {
        id: '3',
        title: 'Your subscription is about to expire!',
        description: t('datetime.days_ago_with_value', { days: 2 }),
        type: 'warning',
        read: false
      }
    ],
    [t]
  );

  const handleMarkAllAsRead = useCallback(() => {
    toast.success(t('notification.marked_all_as_read'), {
      description: t('notification.marked_all_as_read_description')
    });
  }, [t, toast]);

  const handleTogglePushSettings = useCallback(
    (enabled: boolean) => {
      setPushEnabled(enabled);
      if (enabled) {
        toast.info(t('notification.push_notifications_enabled'));
      } else {
        toast.info(t('notification.push_notifications_disabled'));
      }
    },
    [t, toast]
  );

  const headerClassName = cn(
    'flex items-center border-b-0 backdrop-blur-xl transition-all duration-300',
    'bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90'
  );

  if (isLoading) {
    return (
      <ShellHeader className={headerClassName} {...rest}>
        <div className='flex items-center flex-shrink-0'>
          <Logo
            className='w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 transition-colors duration-300'
            type='min'
            height='2.625rem'
            color='white'
          />
          <div className='ml-4 text-slate-600 dark:text-slate-400 text-sm hidden sm:block animate-pulse'>
            Loading navigation...
          </div>
        </div>

        <div className='flex items-center gap-x-2 sm:gap-x-3 flex-shrink-0 px-4 ml-auto'>
          {showMobileMenuButton && (
            <Button
              variant='unstyle'
              size='sm'
              className='md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 transition-colors duration-200'
              onClick={onMobileMenuToggle}
              aria-label='Toggle mobile menu'
            >
              <Icons name='IconMenu2' />
            </Button>
          )}

          <div className='hidden md:flex items-center gap-x-3'>
            <Search />
            <LanguageSwitcher />
            <Preferences />
            <Notifications
              items={notifications}
              onMarkAllAsRead={handleMarkAllAsRead}
              onTogglePushSettings={handleTogglePushSettings}
              pushEnabled={pushEnabled}
            />
            <SpaceDropdown />
          </div>

          <AccountDropdown />
        </div>
      </ShellHeader>
    );
  }

  return (
    <ShellHeader className={headerClassName} {...rest}>
      <div className='flex items-center flex-shrink-0'>
        <Logo
          className='w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 transition-colors duration-300'
          type='min'
          height='2.625rem'
          color='white'
        />
      </div>

      <div className='hidden md:flex flex-1 min-w-0 overflow-hidden'>
        {headerMenus.length > 0 && <MainNavigation menus={headerMenus} withSubmenu />}
      </div>

      <div className='flex items-center gap-x-2 sm:gap-x-3 flex-shrink-0 px-4 ml-auto'>
        {showMobileMenuButton && (
          <Button
            variant='unstyle'
            size='sm'
            className={cn(
              'md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2',
              'hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200'
            )}
            onClick={onMobileMenuToggle}
            aria-label='Toggle mobile menu'
          >
            <Icons name='IconMenu2' />
          </Button>
        )}

        <div className='hidden sm:flex md:hidden items-center gap-x-2'>
          <LanguageSwitcher />
          <Notifications
            items={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onTogglePushSettings={handleTogglePushSettings}
            pushEnabled={pushEnabled}
          />
          <SpaceDropdown />
        </div>

        <div className='hidden md:flex items-center gap-x-2'>
          <Search />
          <LanguageSwitcher />
          <Preferences />
          <Notifications
            items={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onTogglePushSettings={handleTogglePushSettings}
            pushEnabled={pushEnabled}
          />
          <SpaceDropdown />
        </div>

        <div className='border-l border-slate-600 h-5 mx-2' />
        <AccountDropdown />
      </div>
    </ShellHeader>
  );
};

export const Header = React.memo(HeaderComponent);
