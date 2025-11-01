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
      className={`font-semibold text-[1.75rem]/[1.25] md:text-[2rem]/[1.25] xl:text-[2.25rem]/[1.25] ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </h2>
  );
}
