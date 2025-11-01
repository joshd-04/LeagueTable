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
      className={`font-normal text-[1.25rem]/[1.4] md:text-[1.375rem]/[1.4] xl:text-[1.5rem]/[1.4]  ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </h4>
  );
}
