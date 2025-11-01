import React, { CSSProperties } from 'react';

export default function Paragraph({
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
      className={`font-normal text-[1rem]/[1.65] md:text-[1.125rem]/[1.65] xl:text-[1.25rem]/[1.65] ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </p>
  );
}
