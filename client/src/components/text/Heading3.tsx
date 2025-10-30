import React, { CSSProperties } from 'react';

export default function Heading3({
  style,
  className,
  children,
}: {
  style?: CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      className={`font-normal text-[1.75rem] md:text-[2rem] xl:text-[2.75rem] text-[var(--text)] ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </h3>
  );
}
