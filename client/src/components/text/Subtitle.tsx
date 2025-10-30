import React, { CSSProperties } from 'react';

export default function Subtitle({
  style,
  className,
  children,
}: {
  style?: CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`font-normal text-[1.125rem] md:text-[1.25rem] xl:text-[1.5rem] ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </span>
  );
}
