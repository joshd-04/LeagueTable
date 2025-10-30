import React, { CSSProperties } from 'react';

export default function Heading2({
  style,
  className,
  children,
}: {
  style?: CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      className={`font-semibold text-[2rem] md:text-[2.5rem] xl:text-[3.5rem] text-[var(--text)] ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </h2>
  );
}
