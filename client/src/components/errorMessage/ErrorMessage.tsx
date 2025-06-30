'use client';
import { useContext } from 'react';
import Button from '../text/Button';
import Paragraph from '../text/Paragraph';
import Subtitle from '../text/Subtitle';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { AnimatePresence, motion } from 'motion/react';

export default function ErrorMessage() {
  const { error, setError } = useContext(GlobalContext).errors;
  console.log('hello');

  return (
    <>
      <AnimatePresence>
        {' '}
        {error && (
          <motion.div
            key="dropping-box"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`w-[440px] bg-[var(--bg-light)] fixed left-[50%] top-[50px] translate-x-[-50%] rounded-[10px] border-1 border-solid border-[var(--border)] py-[10px] px-[20px] z-10`}
          >
            <Subtitle style={{ color: 'var(--danger)' }}>Error</Subtitle>
            <Paragraph style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              {error}
            </Paragraph>
            <Button
              color="var(--danger)"
              bgHoverColor="var(--bg)"
              style={{ fontSize: '1rem', float: 'right' }}
              onClick={() => setError('')}
            >
              Dismiss
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-[100vw] h-[100vh] fixed top-0 left-0 bg-transparent backdrop-blur-[2px]"
          ></motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
