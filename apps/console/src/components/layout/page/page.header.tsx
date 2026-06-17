import React, { useCallback, useEffect, useMemo } from 'react';

import { Button, Icons, useToastMessage, ShellHeader } from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useNavigationMenus } from '../layout.hooks';
import { AccountDropdown, MainNavigation, SpaceDropdown } from '../navigation';

import { LanguageSwitcher } from '@/components/language_switcher';
import { Logo } from '@/components/logo';
import { Notifications, NotificationItem } from '@/components/notifications/notification';
import {
  mapRealtimeNotificationToItem,
  RealtimeNotification,
  useMarkAllRealtimeNotificationsAsRead,
  useMarkRealtimeNotificationAsRead,
  useNotificationService,
  useRealtimeNotifications
} from '@/components/notifications/notification.service';
import { Preferences } from '@/components/preferences';
import { Search } from '@/components/search/search';
import { useAuthContext } from '@/features/account/context';
import { useMenuPermissions } from '@/features/account/permissions';
import { useQueryNavigationMenus } from '@/features/system/menu/service';
import { filterMenuTreeByFeatureExposure } from '@/lib/features/exposure';

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
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuthContext();
  const { settings, updateSettings } = useNotificationService();
  const markAsReadMutation = useMarkRealtimeNotificationAsRead();
  const markAllAsReadMutation = useMarkAllRealtimeNotificationsAsRead();

  const { filterMenuTree, canAccessMenu } = useMenuPermissions();

  const currentUserId = useMemo(() => {
    return (
      authUser?.user?.id || authUser?.user_id || authUser?.id || authUser?.profile?.user_id || ''
    );
  }, [authUser]);

  const notificationsEnabled = isAuthenticated && !!currentUserId;
  const notificationParams = useMemo(
    () => ({ user_id: currentUserId, limit: 10 }),
    [currentUserId]
  );
  const unreadNotificationParams = useMemo(
    () => ({ user_id: currentUserId, status: 0, limit: 1 }),
    [currentUserId]
  );
  const {
    data: notificationData,
    isLoading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications
  } = useRealtimeNotifications(notificationParams, { enabled: notificationsEnabled });
  const { data: unreadNotificationData } = useRealtimeNotifications(unreadNotificationParams, {
    enabled: notificationsEnabled
  });

  useEffect(() => {
    if (!menuTreeData || typeof menuTreeData !== 'object') return;

    try {
      const filteredGroups = {
        headers: filterMenuTreeByFeatureExposure(filterMenuTree(menuTreeData.headers || [])),
        sidebars: filterMenuTreeByFeatureExposure(filterMenuTree(menuTreeData.sidebars || [])),
        accounts: filterMenuTreeByFeatureExposure(filterMenuTree(menuTreeData.accounts || [])),
        spaces: filterMenuTreeByFeatureExposure(filterMenuTree(menuTreeData.spaces || []))
      };

      setNavigationMenus(filteredGroups);
    } catch (filterError) {
      console.error('Error applying menu permissions:', filterError);
      toast.error(t('menu.permission_filter_error', 'Failed to apply menu permissions'));
    }
  }, [menuTreeData, setNavigationMenus, toast, t, filterMenuTree]);

  useEffect(() => {
    if (!error || isLoading) return;

    console.error('Failed to load menu data:', error);
    toast.error(t('menu.load_error', 'Failed to load navigation menu'));
  }, [error, isLoading, toast, t]);

  const headerMenus = useMemo(() => {
    if (!navigationMenus.headers) return [];
    return navigationMenus.headers.filter(
      menu => !menu.hidden && !menu.disabled && (canAccessMenu(menu) || !!menu.children?.length)
    );
  }, [navigationMenus.headers, canAccessMenu]);

  const handleNotificationClick = useCallback(
    async (notification: RealtimeNotification) => {
      if (notification.status !== 1) {
        try {
          await markAsReadMutation.mutateAsync(notification.id);
        } catch (markError) {
          console.error('Failed to mark notification as read:', markError);
          toast.error(t('notification.mark_as_read_failed', 'Failed to mark notification as read'));
          return;
        }
      }

      const link = notification.links?.find(item => {
        const value = item?.path || item?.url || item?.href;
        return typeof value === 'string' && value.length > 0;
      });
      const href = link?.path || link?.url || link?.href;
      if (typeof href !== 'string' || href.length === 0) return;

      if (/^https?:\/\//i.test(href)) {
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
      }
      navigate(href.startsWith('/') ? href : `/${href}`);
    },
    [markAsReadMutation, navigate, t, toast]
  );

  const notifications = useMemo<NotificationItem[]>(
    () =>
      (notificationData?.items || []).map(notification =>
        mapRealtimeNotificationToItem(notification, handleNotificationClick)
      ),
    [notificationData?.items, handleNotificationClick]
  );

  const unreadCount =
    unreadNotificationData?.total ?? notifications.filter(item => !item.read).length;

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast.success(t('notification.marked_all_as_read'), {
        description: t('notification.marked_all_as_read_description')
      });
    } catch (markError) {
      console.error('Failed to mark all notifications as read:', markError);
      toast.error(
        t('notification.mark_all_as_read_failed', 'Failed to mark all notifications as read')
      );
    }
  }, [markAllAsReadMutation, t, toast]);

  const handleTogglePushSettings = useCallback(
    (enabled: boolean) => {
      updateSettings({ pushEnabled: enabled, desktopEnabled: enabled });
      if (enabled) {
        toast.info(t('notification.push_notifications_enabled'));
      } else {
        toast.info(t('notification.push_notifications_disabled'));
      }
    },
    [t, toast, updateSettings]
  );

  const notificationPanelProps = useMemo(
    () => ({
      items: notifications,
      unreadCount,
      badgeCount: unreadCount,
      onMarkAllAsRead: handleMarkAllAsRead,
      onTogglePushSettings: handleTogglePushSettings,
      pushEnabled: settings.pushEnabled,
      isLoading: notificationsEnabled && notificationsLoading,
      errorMessage: notificationsError
        ? t('notification.load_error', 'Failed to load notifications')
        : undefined,
      onRetry: () => refetchNotifications(),
      isMarkingAllAsRead: markAllAsReadMutation.isPending,
      emptyMessage: notificationsEnabled
        ? t('notification.no_notifications')
        : t('notification.unavailable', 'Notifications are unavailable')
    }),
    [
      handleMarkAllAsRead,
      handleTogglePushSettings,
      markAllAsReadMutation.isPending,
      notifications,
      notificationsEnabled,
      notificationsError,
      notificationsLoading,
      refetchNotifications,
      settings.pushEnabled,
      t,
      unreadCount
    ]
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
            <Notifications {...notificationPanelProps} />
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
          <Notifications {...notificationPanelProps} />
          <SpaceDropdown />
        </div>

        <div className='hidden md:flex items-center gap-x-2'>
          <Search />
          <LanguageSwitcher />
          <Preferences />
          <Notifications {...notificationPanelProps} />
          <SpaceDropdown />
        </div>

        <div className='border-l border-slate-600 h-5 mx-2' />
        <AccountDropdown />
      </div>
    </ShellHeader>
  );
};

export const Header = React.memo(HeaderComponent);
