import { useCallback, useEffect, useState } from 'react';

import { NotificationItem } from './notification';

import { useLocalStorage } from '@/hooks/use_local_storage';

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

  // Sync local state with storage
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
