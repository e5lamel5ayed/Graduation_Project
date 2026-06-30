// src/types/notification.ts
export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  relatedEntityId: string | null;
  isRead: boolean;
  createdAt: string;
}