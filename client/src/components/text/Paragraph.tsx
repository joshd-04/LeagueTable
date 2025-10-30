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
      className={`font-normal text-[1rem] md:text-[1.125rem] xl:text-[1.25rem] ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </p>
  );
}
