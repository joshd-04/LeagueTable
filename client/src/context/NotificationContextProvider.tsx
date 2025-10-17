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
  dismiss: (notificationId: string) => void;
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
    const resolved: NotificationInterface = {
      ...notification,
      title:
        typeof notification.title === 'function'
          ? (notification.title as () => string)()
          : (notification.title as string),
      description:
        typeof notification.description === 'function'
          ? (notification.description as () => string)()
          : (notification.description as string),
    };

    const alreadyExists = notificationsRef.current.some(
      (n) => n.id === resolved.id
    );

    if (alreadyExists) {
      // Clear existing timer and dismiss
      dismiss(resolved.id);

      // Re-add after a short delay to trigger visual re-entry or shake
      setTimeout(() => {
        show(resolved);
      }, 50); // small delay to force re-render / animation
      return;
    }

    // Show new notification
    setNotifications((prev) => {
      if (prev.length === maxNotifications) {
        return [{ ...resolved }, ...prev.slice(0, maxNotifications - 1)];
      }
      return [{ ...resolved }, ...prev];
    });

    const t: ReturnType<typeof setTimeout> = setTimeout(() => {
      dismiss(resolved.id);
    }, resolved.duration + 400);

    timers.current.set(resolved.id, t);
  }

  function dismiss(notificationId: string) {
    clearTimeout(timers.current.get(notificationId));
    timers.current.delete(notificationId);
    setNotifications((prev) =>
      prev.filter((n) => {
        return n.id !== notificationId;
      })
    );
  }

  // Scroll functionality
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const minimum_top = 32;
  const navbar_height = 84;

  const notification_top =
    navbar_height + minimum_top - scrollY > minimum_top
      ? navbar_height + minimum_top - scrollY
      : minimum_top;

  return (
    <NotificationContext.Provider value={{ setNotifications, show, dismiss }}>
      {children}
      <div
        className="fixed right-[50px] space-y-2 z-50 flex flex-col  "
        style={{ top: `${notification_top}px` }}
      >
        {notifications.map((n) => (
          <Notification key={n.id} notification={n} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
