import { NotificationInterface } from '@/util/definitions';
import Paragraph from '../text/Paragraph';
import InfoSVG from '@/assets/svg components/Info';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import WarningSVG from '@/assets/svg components/Warning';
import ErrorSVG from '@/assets/svg components/Error';
import SuccessSVG from '@/assets/svg components/Success';
import Label from '../text/Label';
import { useNotification } from '@/context/NotificationContextProvider';

export default function Notification({
  notification,
}: {
  notification: NotificationInterface;
}) {
  // console.log(notification);

  //  Handles the fade in / fade out animation
  const [display, setDisplay] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setDisplay(false);
    }, notification.duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remove the notification early
  const { setNotifications } = useNotification();

  const titleText =
    typeof notification.title === 'string'
      ? notification.title
      : notification.title();

  const descriptionText =
    notification.description === undefined
      ? undefined
      : typeof notification.description === 'string'
      ? notification.description
      : notification.description();

  function removeNotification() {
    setDisplay(false);
    setTimeout(() => {
      setNotifications((prev) => {
        return prev.filter((noti) => noti.id !== notification.id);
      });
    }, 400);
  }

  let icon = (
    <InfoSVG className="w-[24px] h-[24px] fill-[var(--info)] inline align-middle  " />
  );
  let colour = 'var(--info)';

  switch (notification.type) {
    case 'info':
      colour = 'var(--info)';
      icon = (
        <InfoSVG className="w-[24px] h-[24px] fill-[var(--info)] inline align-middle  " />
      );
      break;
    case 'success':
      colour = 'var(--success)';
      icon = (
        <SuccessSVG className="w-[24px] h-[24px] fill-[var(--success)] inline align-middle  " />
      );
      break;
    case 'warning':
      colour = 'var(--warning)';
      icon = (
        <WarningSVG className="w-[24px] h-[24px] fill-[var(--warning)] inline align-middle  " />
      );
      break;
    case 'error':
      colour = 'var(--danger)';
      icon = (
        <ErrorSVG className="w-[24px] h-[24px] fill-[var(--danger)] inline align-middle  " />
      );
      break;
    default:
      icon = (
        <InfoSVG className="w-[24px] h-[24px] fill-[var(--info)] inline align-middle  " />
      );
      break;
  }

  return (
    <AnimatePresence>
      {display && (
        <motion.div
          key="dropping-box"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`w-[440px] bg-[var(--bg)] rounded-[10px] border-1 border-solid border-[var(--border)] py-[10px] px-[20px] z-10 relative  shadow overflow-hidden hover:bg-[var(--bg-light)] hover:cursor-pointer`}
          whileTap={{ scale: 0.98 }}
          onClick={() => removeNotification()}
        >
          <span>
            {icon}{' '}
            <Paragraph
              style={{
                color: colour,
                display: 'inline',
                verticalAlign: 'middle',
              }}
            >
              {titleText}
            </Paragraph>
          </span>
          {notification.description !== undefined && (
            <Label style={{ fontSize: '1rem' }}>{descriptionText}</Label>
          )}

          <SwipeBackground color={colour} duration={notification.duration} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SwipeBackground({
  color,
  duration = 3000,
}: {
  color: string;
  duration?: number;
}) {
  return (
    <>
      <div
        className="absolute bottom-0 left-0 h-1 rounded-[10px]"
        style={{
          backgroundColor: color ?? 'white',
          animation: `progress-bar ${duration ?? 3000}ms linear forwards`,
        }}
      />
      <style jsx>{`
        @keyframes progress-bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-progress-bar {
          animation: progress-bar 3000ms linear forwards;
        }
      `}</style>
    </>
  );
}
