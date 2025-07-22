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
} from 'react';

type NotificationContextType = {
  setNotifications: Dispatch<SetStateAction<NotificationInterface[]>>;
  show: (notification: Omit<NotificationInterface, 'id'>) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error('useNotification must be used inside NotificationProvider');
  return ctx;
}

let idCounter = 0;

export function NotificationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );

  function show(notification: Omit<NotificationInterface, 'id'>) {
    // if notification already shown, restart it
    const id = idCounter++;
    setNotifications((prev) => {
      const exists = prev.filter((noti) => {
        return (
          noti.title === notification.title &&
          noti.description === notification.description &&
          noti.type === notification.type &&
          noti.duration === notification.duration
        );
      });

      if (exists.length > 0) {
        const existingNoti = exists[0];
        return [
          ...prev.filter((noti) => noti.id !== existingNoti.id),
          { ...existingNoti, resetCount: existingNoti.resetCount + 1 },
        ];
      }

      return [...prev, { ...notification, id }];
    });

    if (!notification.manualDismiss) {
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => {
            return n.id !== id;
          })
        );
      }, notification.duration + 400);
    }
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
