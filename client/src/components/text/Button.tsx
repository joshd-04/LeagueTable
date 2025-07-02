'use client';
import React, { CSSProperties, useState } from 'react';
import { motion } from 'motion/react';
import './effects.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  color: string;
  bgHoverColor: string;
  borderlessButton?: boolean;
  underlineEffect?: boolean;
  shadowEffect?: boolean;
  style?: CSSProperties;
  children: React.ReactNode;
}

export default function Button({
  type = 'button',
  onClick,
  color,
  bgHoverColor,
  borderlessButton = false,
  underlineEffect = borderlessButton,
  shadowEffect = true,
  style,
  children,
}: ButtonProps) {
  const [isHovering, setIsHovering] = useState(false);
  const border = !borderlessButton ? 'border-2 border-solid' : '';
  const shadow = shadowEffect ? 'shadow-[var(--shadow)]' : '';
  const bg = isHovering ? bgHoverColor : 'transparent';

  style = {
    backgroundColor: bg,
    color: color,
    ...style,
  };

  return (
    <motion.button
      className={`font-[family-name:var(--font-instrument-sans)] font-semibold text-[1rem] md:text-[1.125rem] xl:text-[1.25rem] text-[var(--text)] py-[5px] px-[20px] cursor-pointer rounded-[10px] ${border} ${shadow} hover:border-transparent   transition-colors duration-250 text-center`}
      onClick={onClick}
      type={type}
      whileHover={
        {
          // backgroundColor: bgHoverColor,
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
          className={`relative after:content-[''] after:h-[3px] after:left-[0px] after:bottom-[-5px] after:block  after:absolute underline-container-bg ${
            isHovering ? 'after:w-full' : 'after:w-0'
          } after:transition-all `}
        >
          {children}
        </span>
      ) : (
        <>{children}</>
      )}
    </motion.button>
  );
}
