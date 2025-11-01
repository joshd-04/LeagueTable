import React, { CSSProperties } from 'react';

export default function Heading1({
  style,
  className,
  children,
}: {
  style?: CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h1
      className={`inline font-bold text-[2rem]/[1.5] md:text-[2.5rem]/[1.5] xl:text-[3rem]/[1.5]  ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </h1>
  );
}
