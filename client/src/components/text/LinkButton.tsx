'use client';
import React, { CSSProperties, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';

interface ButtonProps {
  href: Url;
  color: string;
  bgHoverColor: string;
  borderlessButton?: boolean;
  underlineEffect?: boolean;
  shadowEffect?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  children: React.ReactNode;
}

export default function LinkButton({
  href,
  color,
  bgHoverColor,
  borderlessButton = false,
  underlineEffect = borderlessButton,
  shadowEffect = true,
  disabled = false,
  style,
  children,
}: ButtonProps) {
  const [isHovering, setIsHovering] = useState(false);

  const border = !borderlessButton
    ? `border-2 border-solid border-[${disabled ? 'var(--border)' : color}]`
    : '';
  const shadow = shadowEffect ? 'shadow-[var(--shadow)]' : '';
  let bg = 'transparent';
  if (isHovering && !disabled) {
    bg = bgHoverColor;
  } else if (isHovering && disabled) {
    bg = 'transparent';
  }

  style = {
    backgroundColor: bg,
    color: disabled ? 'var(--border) ' : color,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style,
  };

  return (
    <Link href={href} passHref className="">
      <motion.div
        className={`inline-block w-full font-[family-name:var(--font-instrument-sans)] font-semibold text-[1rem] md:text-[1.125rem] xl:text-[1.25rem]  py-[5px] px-[20px]  rounded-[10px] ${border} ${shadow} ${
          !disabled && 'hover:border-transparent'
        } transition-colors duration-250 text-center`}
        whileHover={
          {
            // backgroundColor: bgHoverColor,
            // borderColor: 'transparent',
          }
        }
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onFocus={() => setIsHovering(true)}
        onBlur={() => setIsHovering(false)}
        style={style}
      >
        {/* If its a borderless button show the underline effect */}
        {underlineEffect ? (
          <span
            className={`relative after:content-[''] after:h-[3px] after:left-[0px] after:bottom-[-5px] after:block underline-container-bg w-full after:absolute ${
              isHovering ? 'after:w-full' : 'after:w-0'
            } after:transition-all`}
          >
            {children}
          </span>
        ) : (
          <>{children}</>
        )}
      </motion.div>
    </Link>
  );
}
