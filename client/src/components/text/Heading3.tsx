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
      className={`font-normal text-[1.5rem]/[1.35] md:text-[1.625rem]/[1.35] xl:text-[1.75rem]/[1.35] ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </h3>
  );
}
