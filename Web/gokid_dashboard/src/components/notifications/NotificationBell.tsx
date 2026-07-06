'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import type { Notification } from '@/src/types/notification';
import { useNotifications } from '@/app/signalr-provider';

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function NotificationBell() {
  const { notifications, unreadCount, loading, loadNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && notifications.length === 0) {
      void loadNotifications();
    }
  };

  const handleItemClick = (notification: Notification) => {
    if (!notification.isRead) void markAsRead(notification.id);
  };

  return (
    <>
      {/* Backdrop overlay with blur */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px] transition-opacity duration-200" />
      )}

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={handleToggle}
          className={`relative p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b9a2c5] ${
            open ? 'z-50 bg-gray-100 text-[#5c5163]' : 'text-gray-500 hover:text-[#5c5163] hover:bg-gray-100'
          }`}
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-96 max-w-[90vw] rounded-2xl border border-gray-100 bg-white shadow-2xl z-50">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => void markAllAsRead()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#9a87a4] hover:text-[#5c5163]"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-sm text-gray-400">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-400">No notifications yet.</div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleItemClick(notification)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-[#f7f3f9]' : ''
                    }`}
                  >
                    {!notification.isRead && (
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#9a87a4]" />
                    )}
                    <div className={`min-w-0 flex-1 ${notification.isRead ? 'ml-5' : ''}`}>
                      <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{notification.body}</p>
                      <p className="mt-1 text-[11px] text-gray-400">{timeAgo(notification.createdAt)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}