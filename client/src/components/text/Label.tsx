import React, { CSSProperties } from 'react';

export default function Label({
  style,
  className,
  children,
}: {
  style?: CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`text-[0.875rem] md:text-[0.875rem] xl:text-[1rem] text-[var(--text-muted)] ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </p>
  );
}
