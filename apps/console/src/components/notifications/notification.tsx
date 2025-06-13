import { useCallback, useMemo } from 'react';

import {
  Badge,
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Icons,
  Switch,
  Tooltip
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  read?: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

export interface NotificationsProps {
  /**
   * Array of notification items to display
   */
  items: NotificationItem[];

  /**
   * Maximum number of notifications to show in the dropdown
   * @default 5
   */
  maxItems?: number;

  /**
   * Called when the "Mark all as read" button is clicked
   */
  onMarkAllAsRead?: () => void;

  /**
   * Called when notification push settings are toggled
   */
  onTogglePushSettings?: (_enabled: boolean) => void;

  /**
   * Whether push notifications are enabled
   */
  pushEnabled?: boolean;

  /**
   * Custom trigger element
   */
  customTrigger?: React.ReactNode;

  /**
   * Badge count override (if not provided, will use the number of unread notifications)
   */
  badgeCount?: number;

  /**
   * Custom class name for the trigger button
   */
  triggerClassName?: string;

  /**
   * Custom icon for the notification trigger button
   */
  triggerIcon?: string;

  /**
   * Custom class name for the hover card content
   */
  contentClassName?: string;

  /**
   * Custom empty state message
   */
  emptyMessage?: string;
}

/**
 * A reusable notifications component
 */
export const Notifications = ({
  items = [],
  maxItems = 5,
  onMarkAllAsRead,
  onTogglePushSettings,
  pushEnabled = true,
  customTrigger,
  badgeCount,
  triggerClassName = 'relative text-slate-400/85 dark:text-slate-500/70 [&>svg]:stroke-slate-400/70 dark:[&>svg]:stroke-slate-500/70',
  triggerIcon = 'IconBell',
  contentClassName = '',
  emptyMessage
}: NotificationsProps) => {
  const { t } = useTranslation();

  const unreadCount = useMemo(() => {
    return items.filter(item => !item.read).length;
  }, [items]);

  const displayCount = badgeCount !== undefined ? badgeCount : unreadCount;

  const handleNotificationClick = useCallback((notification: NotificationItem) => {
    if (notification.onClick) {
      notification.onClick();
    }
  }, []);

  const _getTypeIcon = (type: NotificationItem['type'] = 'info') => {
    const icons = {
      info: 'IconInfo',
      success: 'IconCheck',
      warning: 'IconAlertTriangle',
      error: 'IconAlertCircle'
    };
    return icons[type] || 'IconBell';
  };

  const getTypeColor = (type: NotificationItem['type'] = 'info') => {
    const colors = {
      info: 'bg-blue-500/90 dark:bg-blue-400/90',
      success: 'bg-green-500/90 dark:bg-green-400/90',
      warning: 'bg-amber-500/90 dark:bg-amber-400/90',
      error: 'bg-red-500/90 dark:bg-red-400/90'
    };
    return colors[type] || 'bg-blue-500/90 dark:bg-blue-400/90';
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {customTrigger || (
          <Button
            variant='unstyle'
            className={`${triggerClassName} transition-colors duration-200`}
            aria-label={t('notification.title')}
          >
            {displayCount > 0 && (
              <Badge className='absolute top-0 right-0 text-[10px] px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500/90 dark:bg-red-400/90 text-white transform scale-90'>
                {displayCount}
              </Badge>
            )}
            <Icons name={triggerIcon} className='w-5 h-5 text-slate-300 dark:text-slate-300' />
          </Button>
        )}
      </HoverCardTrigger>
      <HoverCardContent
        className={`p-0 mt-3.5 w-80 shadow-lg dark:bg-slate-800 dark:border-slate-700 backdrop-blur-sm ${contentClassName}`}
      >
        <CardHeader className='flex-row justify-between'>
          <div className='inline-flex flex-col space-y-1.5'>
            <CardTitle className='dark:text-slate-100'>{t('notification.title')}</CardTitle>
            <CardDescription className='dark:text-slate-400'>
              {unreadCount > 0
                ? t('notification.you_have_unread_notification_plural', {
                    count: unreadCount
                  })
                : t('notification.no_unread_notifications')}
            </CardDescription>
          </div>
          {onTogglePushSettings && (
            <Tooltip side='bottom' content={t('notification.push_setting')}>
              <Switch checked={pushEnabled} onCheckedChange={onTogglePushSettings} />
            </Tooltip>
          )}
        </CardHeader>
        <CardContent className='p-0 px-4 grid gap-3 max-h-[15rem] my-3 overflow-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700'>
          {items.length === 0 ? (
            <div className='text-center py-4 text-slate-400 dark:text-slate-500'>
              {emptyMessage || t('notification.no_notifications')}
            </div>
          ) : (
            items.slice(0, maxItems).map(notification => (
              <div
                key={notification.id}
                className='grid grid-cols-[22px_1fr] items-start gap-3 last:mb-0 last:pb-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 px-3 py-2 rounded-lg transition-colors duration-200'
                onClick={() => handleNotificationClick(notification)}
                role='button'
                tabIndex={0}
              >
                <Badge
                  size='sm'
                  className={`mt-1 ${getTypeColor(notification.type)} shadow-sm`}
                  aria-hidden='true'
                />
                <div className='space-y-1.5'>
                  <p
                    className={`text-slate-700 dark:text-slate-200 px-0 leading-5 text-justify text-wrap ${
                      !notification.read ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    {notification.title}
                  </p>
                  {notification.description && (
                    <p className='text-slate-400 dark:text-slate-500 text-sm'>
                      {notification.description}
                    </p>
                  )}
                  {notification.timestamp && (
                    <p className='text-slate-400 dark:text-slate-500 text-xs'>
                      {notification.timestamp}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          {items.length > maxItems && (
            <div className='text-center text-slate-400 dark:text-slate-500 text-sm'>
              {t('notification.and_more_notifications', {
                count: items.length - maxItems
              })}
            </div>
          )}
        </CardContent>
        {onMarkAllAsRead && items.length > 0 && unreadCount > 0 && (
          <CardFooter className='mt-4'>
            <Button className='w-full' onClick={onMarkAllAsRead}>
              <Icons name='IconCheck' className='mr-2' /> {t('actions.mark_all_as_read')}
            </Button>
          </CardFooter>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
