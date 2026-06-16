import { useCallback, useEffect, useState } from 'react';

import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { NotificationItem } from './notification';

import { useLocalStorage } from '@/hooks/use_local_storage';
import { request } from '@/lib/api/request';

// Storage keys
export const NOTIFICATIONS_STORAGE_KEY = 'app.notifications';
export const NOTIFICATIONS_SETTINGS_KEY = 'app.notifications.settings';

// Default settings
export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  desktopEnabled: boolean;
  soundEnabled: boolean;
}

const defaultSettings: NotificationSettings = {
  pushEnabled: true,
  emailEnabled: true,
  desktopEnabled: true,
  soundEnabled: true
};

export interface RealtimeNotification {
  id: string;
  title: string;
  content: string;
  type?: string;
  user_id: string;
  status: number;
  channel_id?: string;
  links?: Record<string, any>[];
  created_at?: number;
  updated_at?: number;
}

export interface RealtimeNotificationListParams {
  user_id?: string;
  status?: number;
  channel_id?: string;
  cursor?: string;
  limit?: number;
  direction?: 'forward' | 'backward';
}

export interface RealtimeNotificationListResult {
  items: RealtimeNotification[];
  total: number;
  cursor?: string;
  next_cursor?: string;
  prev_cursor?: string;
  has_next?: boolean;
  has_prev?: boolean;
}

export const realtimeNotificationKeys = {
  all: ['realtimeNotificationService'] as const,
  list: (params?: RealtimeNotificationListParams) =>
    ['realtimeNotificationService', 'list', params || {}] as const
};

const buildNotificationQuery = (params?: RealtimeNotificationListParams) => {
  if (!params) return '';

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.set(key, String(value));
  });
  return query.toString();
};

const toNotificationDate = (value?: number) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const toNotificationType = (type?: string): NotificationItem['type'] => {
  switch ((type || '').toLowerCase()) {
    case 'success':
    case 'completed':
      return 'success';
    case 'warning':
    case 'warn':
      return 'warning';
    case 'error':
    case 'failed':
      return 'error';
    default:
      return 'info';
  }
};

export const mapRealtimeNotificationToItem = (
  notification: RealtimeNotification,
  onClick?: (_notification: RealtimeNotification) => void
): NotificationItem => {
  const createdAt = toNotificationDate(notification.created_at);

  return {
    id: notification.id,
    title: notification.title,
    description: notification.content,
    timestamp: createdAt ? formatRelativeTime(createdAt) : undefined,
    type: toNotificationType(notification.type),
    read: notification.status === 1,
    onClick: () => onClick?.(notification),
    metadata: {
      absoluteTime: createdAt ? formatDateTime(createdAt, 'dateTime') : undefined,
      channelId: notification.channel_id,
      links: notification.links || []
    }
  };
};

export const listRealtimeNotifications = async (
  params?: RealtimeNotificationListParams
): Promise<RealtimeNotificationListResult> => {
  const query = buildNotificationQuery(params);
  return request.get(`/rt/notifications${query ? `?${query}` : ''}`);
};

export const markRealtimeNotificationAsRead = async (id: string): Promise<void> => {
  return request.put(`/rt/notifications/${id}/read`);
};

export const markAllRealtimeNotificationsAsRead = async (): Promise<void> => {
  return request.put('/rt/notifications/read-all');
};

export const useRealtimeNotifications = (
  params?: RealtimeNotificationListParams,
  options?: { enabled?: boolean; refetchInterval?: number | false }
) =>
  useQuery({
    queryKey: realtimeNotificationKeys.list(params),
    queryFn: () => listRealtimeNotifications(params),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
    refetchInterval: options?.refetchInterval ?? 60 * 1000
  });

export const useMarkRealtimeNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markRealtimeNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: realtimeNotificationKeys.all });
    }
  });
};

export const useMarkAllRealtimeNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllRealtimeNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: realtimeNotificationKeys.all });
    }
  });
};

/**
 * Notification service hook for managing notifications
 */
export const useNotificationService = () => {
  // Storage for notifications
  const { storedValue: storedNotifications, setValue: setStoredNotifications } = useLocalStorage<
    NotificationItem[]
  >(NOTIFICATIONS_STORAGE_KEY, []);

  // Storage for notification settings
  const { storedValue: storedSettings, setValue: setStoredSettings } =
    useLocalStorage<NotificationSettings>(NOTIFICATIONS_SETTINGS_KEY, defaultSettings);

  // Local state
  const [notifications, setNotifications] = useState<NotificationItem[]>(storedNotifications || []);
  const [settings, setSettings] = useState<NotificationSettings>(storedSettings || defaultSettings);

  // Sync local state
  useEffect(() => {
    setNotifications(storedNotifications || []);
  }, [storedNotifications]);

  useEffect(() => {
    setSettings(storedSettings || defaultSettings);
  }, [storedSettings]);

  // Add a new notification
  const addNotification = useCallback(
    (notification: Omit<NotificationItem, 'id'>) => {
      const newNotification: NotificationItem = {
        id: `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        read: false,
        ...notification
      };

      const updatedNotifications = [newNotification, ...notifications];
      setNotifications(updatedNotifications);
      setStoredNotifications(updatedNotifications);

      // If desktop notifications are enabled and the browser supports them
      if (settings.desktopEnabled && 'Notification' in window) {
        // Request permission if not granted
        if (Notification.permission === 'granted') {
          // Create and show notification
          const desktopNotification = new Notification(notification.title, {
            body: notification.description,
            icon: '/favicon.ico' // Replace with your app icon
          });

          // Optional: click handler
          desktopNotification.onclick = () => {
            window.focus();
            if (notification.onClick) {
              notification.onClick();
            }
          };
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }

      return newNotification.id;
    },
    [notifications, setStoredNotifications, settings.desktopEnabled]
  );

  // Mark a notification as read
  const markAsRead = useCallback(
    (id: string) => {
      const updatedNotifications = notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      setNotifications(updatedNotifications);
      setStoredNotifications(updatedNotifications);
    },
    [notifications, setStoredNotifications]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setStoredNotifications(updatedNotifications);
  }, [notifications, setStoredNotifications]);

  // Remove a notification
  const removeNotification = useCallback(
    (id: string) => {
      const updatedNotifications = notifications.filter(notification => notification.id !== id);
      setNotifications(updatedNotifications);
      setStoredNotifications(updatedNotifications);
    },
    [notifications, setStoredNotifications]
  );

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setStoredNotifications([]);
  }, [setStoredNotifications]);

  // Update settings
  const updateSettings = useCallback(
    (newSettings: Partial<NotificationSettings>) => {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      setStoredSettings(updatedSettings);

      // If enabling desktop notifications, request permission
      if (
        newSettings.desktopEnabled &&
        'Notification' in window &&
        Notification.permission !== 'granted'
      ) {
        Notification.requestPermission();
      }

      return updatedSettings;
    },
    [settings, setStoredSettings]
  );

  // Get unread count
  const getUnreadCount = useCallback(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);

  return {
    notifications,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    updateSettings,
    unreadCount: getUnreadCount()
  };
};
