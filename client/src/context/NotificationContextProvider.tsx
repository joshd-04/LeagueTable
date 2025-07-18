'use client';

import Notification from '@/components/notification/Notification';
import { NotificationInterface } from '@/util/definitions';
import { createContext, useContext, useState, ReactNode } from 'react';

type NotificationContextType = {
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

  const show = (notification: Omit<NotificationInterface, 'id'>) => {
    const id = idCounter++;
    setNotifications((prev) => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, notification.duration + 400);
  };

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-[50px] left-[50%] translate-x-[-50%] space-y-2 z-50 flex flex-col">
        {notifications.map((n) => (
          <Notification key={n.id} notification={n} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
