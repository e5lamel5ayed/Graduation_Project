import type { Notification } from '@/src/types/notification';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://go-kid.runasp.net/api';

interface PaginatedNotifications {
  notifications: Notification[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Notification API error: ${res.status}`);
  }

  const text = await res.text();
  if (!text) return undefined as T;

  const json = JSON.parse(text);
  return (json.data ?? json) as T;
}

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const result = await request<PaginatedNotifications>('/notifications');
    return result.notifications ?? [];
  },
  getUnreadCount: () => request<number>('/notifications/unread-count'),
  markAsRead: (id: string) => request<void>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllAsRead: () => request<void>('/notifications/read-all', { method: 'PATCH' }),
};