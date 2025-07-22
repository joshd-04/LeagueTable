'use client';

import { useEffect, useState } from 'react';
import { Notifier } from '@/lib/Notifier';
import { useNotification } from '@/context/NotificationContextProvider';
import { NotificationInterface } from '@/util/definitions';

export function useNotifier(
  config: Omit<NotificationInterface, 'id' | 'resetCount'>
) {
  const notify = useNotification();
  const [notifier, setNotifier] = useState<Notifier | null>(null);

  useEffect(() => {
    const n = new Notifier({ ...config, resetCount: 0 }, (opts) => {
      notify.show({
        ...opts,
      });
    });
    setNotifier(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return notifier;
}
