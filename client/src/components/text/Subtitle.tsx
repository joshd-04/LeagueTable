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
      className={`font-normal text-[1.125rem]/[1.5] md:text-[1.25rem]/[1.5] xl:text-[1.25rem]/[1.5] ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </span>
  );
}
