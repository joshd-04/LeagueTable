'use client';

import Notification from '@/components/notification/Notification';
import { NotificationInterface } from '@/util/definitions';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useRef,
  useEffect,
} from 'react';

type NotificationContextType = {
  setNotifications: Dispatch<SetStateAction<NotificationInterface[]>>;
  show: (notification: NotificationInterface) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error('useNotification must be used inside NotificationProvider');
  return ctx;
}

const maxNotifications = 5;

export function NotificationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );
  const notificationsRef = useRef<NotificationInterface[]>([]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  function show(notification: NotificationInterface) {
    const alreadyExists = notificationsRef.current.some(
      (n) => n.id === notification.id
    );

    if (alreadyExists) {
      // Clear existing timer and dismiss
      dismiss(notification.id);

      // Re-add after a short delay to trigger visual re-entry or shake
      setTimeout(() => {
        show(notification);
      }, 50); // small delay to force re-render / animation
      return;
    }

    // Show new notification
    setNotifications((prev) => {
      if (prev.length === maxNotifications) {
        return [{ ...notification }, ...prev.slice(0, maxNotifications - 1)];
      }
      return [{ ...notification }, ...prev];
    });

    const t: ReturnType<typeof setTimeout> = setTimeout(() => {
      dismiss(notification.id);
    }, notification.duration + 400);

    timers.current.set(notification.id, t);
  }

  function dismiss(id: string) {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setNotifications((prev) =>
      prev.filter((n) => {
        return n.id !== id;
      })
    );
  }

  return (
    <NotificationContext.Provider value={{ setNotifications, show }}>
      {children}
      <div className="fixed top-[100px] right-[50px] space-y-2 z-50 flex flex-col">
        {notifications.map((n) => (
          <Notification key={n.id} notification={n} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
