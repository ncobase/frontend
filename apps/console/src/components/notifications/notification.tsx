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
  triggerClassName = 'relative text-slate-400/70 [&>svg]:stroke-slate-400/70',
  triggerIcon = 'IconBell',
  contentClassName = '',
  emptyMessage
}: NotificationsProps) => {
  const { t } = useTranslation();

  // Count unread notifications
  const unreadCount = useMemo(() => {
    return items.filter(item => !item.read).length;
  }, [items]);

  // Display count (use provided badge count or unread count)
  const displayCount = badgeCount !== undefined ? badgeCount : unreadCount;

  // Handle clicking on a notification
  const handleNotificationClick = useCallback((notification: NotificationItem) => {
    if (notification.onClick) {
      notification.onClick();
    }
  }, []);

  // Get notification type icon
  const _getTypeIcon = (type: NotificationItem['type'] = 'info') => {
    const icons = {
      info: 'IconInfo',
      success: 'IconCheck',
      warning: 'IconAlertTriangle',
      error: 'IconAlertCircle'
    };
    return icons[type] || 'IconBell';
  };

  // Get type color
  const getTypeColor = (type: NotificationItem['type'] = 'info') => {
    const colors = {
      info: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-amber-500',
      error: 'bg-red-500'
    };
    return colors[type] || 'bg-blue-500';
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {customTrigger || (
          <Button
            variant='unstyle'
            size='xs'
            className={triggerClassName}
            aria-label={t('notification.title')}
          >
            {displayCount > 0 && (
              <Badge className='absolute -top-1 -right-1 text-[9px] px-1!'>{displayCount}</Badge>
            )}
            <Icons name={triggerIcon} className='stroke-slate-500/85' />
          </Button>
        )}
      </HoverCardTrigger>
      <HoverCardContent className={`p-0 mt-3.5 w-80 ${contentClassName}`}>
        <CardHeader className='flex-row justify-between'>
          <div className='inline-flex flex-col space-y-1.5'>
            <CardTitle>{t('notification.title')}</CardTitle>
            <CardDescription>
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
        <CardContent className='grid gap-4 max-h-[15rem] mb-3 overflow-auto'>
          {items.length === 0 ? (
            <div className='text-center py-4 text-slate-400'>
              {emptyMessage || t('notification.no_notifications')}
            </div>
          ) : (
            items.slice(0, maxItems).map(notification => (
              <div
                key={notification.id}
                className='grid grid-cols-[22px_1fr] items-start last:mb-0 last:pb-0 cursor-pointer hover:bg-slate-50 p-1 rounded-md'
                onClick={() => handleNotificationClick(notification)}
                role='button'
                tabIndex={0}
              >
                <Badge
                  size='sm'
                  className={`mt-1 ${getTypeColor(notification.type)}`}
                  aria-hidden='true'
                />
                <div className='space-y-1'>
                  <p
                    className={`text-slate-700 px-0 leading-5 text-justify text-wrap font-medium ${
                      !notification.read ? 'font-semibold' : ''
                    }`}
                  >
                    {notification.title}
                  </p>
                  {notification.description && (
                    <p className='text-slate-400'>{notification.description}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {items.length > maxItems && (
            <div className='text-center text-slate-400'>
              {t('notification.and_more_notifications', {
                count: items.length - maxItems
              })}
            </div>
          )}
        </CardContent>
        {onMarkAllAsRead && items.length > 0 && unreadCount > 0 && (
          <CardFooter>
            <Button className='w-full' onClick={onMarkAllAsRead}>
              <Icons name='IconCheck' /> {t('actions.mark_all_as_read')}
            </Button>
          </CardFooter>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
