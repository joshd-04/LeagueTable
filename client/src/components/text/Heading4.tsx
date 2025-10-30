import React, { CSSProperties } from 'react';

export default function Heading4({
  style,
  className,
  children,
}: {
  style?: CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h4
      className={`font-normal text-[1.5rem] md:text-[1.75rem] xl:text-[2rem] text-[var(--text)] ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </h4>
  );
}
