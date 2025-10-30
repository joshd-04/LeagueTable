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
      className={`inline font-bold text-[2.25rem] md:text-[3rem] xl:text-[4.5rem] ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </h1>
  );
}
