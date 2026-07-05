'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import * as signalR from '@microsoft/signalr';
import { toast } from 'sonner';
import type { Notification } from '@/src/types/notification';
import { notificationService } from '@/src/services/notificationService';

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within SignalRProvider');
  return ctx;
}

let globalConnection: signalR.HubConnection | null = null;

export default function SignalRProvider({ children }: { children: ReactNode }) {
  const connectionRef = useRef(false);
  const notificationsLoadedRef = useRef(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
      notificationsLoadedRef.current = true;
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  useEffect(() => {
    void loadUnreadCount();
  }, []);

  useEffect(() => {
    if (connectionRef.current) return;
    connectionRef.current = true;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://go-kid.runasp.net/api';
    const hubUrl = apiBaseUrl.replace('/api', '') + '/hubs/notifications';

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([2000, 5000, 10000])
      .build();

    connection.on('ReceiveNotification', (notification: Notification) => {
      console.log('🔔 ReceiveNotification:', notification);

      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => (notificationsLoadedRef.current ? [notification, ...prev] : prev));

      switch (notification.type) {
        case 'StoryVoiceReady':
          toast.success(notification.title, {
            description: notification.body,
            duration: 8000,
            action: notification.relatedEntityId ? {
              label: 'View Story',
              onClick: () => window.location.href = `/adventures/${notification.relatedEntityId}/story`,
            } : undefined,
          });
          break;

        case 'StoryVoiceFailed':
          toast.error(notification.title, {
            description: notification.body,
          });
          break;

        default:
          toast(notification.title, {
            description: notification.body,
          });
          break;
      }
    });

    connection.onreconnected(async () => {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (user?.id) await connection.invoke('JoinUserGroup', user.id);
      void loadUnreadCount();
    });

    connection.start()
      .then(async () => {
        console.log('✓ SignalR connected globally');
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (user?.id) {
          await connection.invoke('JoinUserGroup', user.id);
          console.log('✓ Joined group:', user.id);
        }
        globalConnection = connection;
      })
      .catch((err) => console.error('SignalR error:', err));

    return () => {
      connection.stop();
      globalConnection = null;
      connectionRef.current = false;
    };
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, loading, loadNotifications, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}