/* eslint-disable jsx-a11y/alt-text */
'use client';

import { LazyMotion, domAnimation, m, useAnimation } from 'framer-motion';
import Image from 'next/image';
import type { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

const animationVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const FadeInImage = (props: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const animationControls = useAnimation();

  useEffect(() => {
    if (isLoaded) {
      animationControls.start('visible');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        animate={animationControls}
        initial="hidden"
        transition={{ duration: 0.5, ease: 'easeOut' }}
        variants={animationVariants}
      >
        {/**
         * If using in a nextjs project, use next/image instead of <img>.
         * The props type should be the same as next/image.
         *
         * ```tsx
         * import type {ImageProps} from "next/image";
         * import Image from "next/image";
         *
         * export const FadeInImage = (props: ImageProps) => {
         *
         *   // existing code...
         *
         *   <Image {...props} onLoad={() => setIsLoaded(true)} />
         *
         *   // existing code...
         * }
         * ```
         */}
        <Image {...props} onLoad={() => setIsLoaded(true)} />
      </m.div>
    </LazyMotion>
  );
};

export default FadeInImage;
