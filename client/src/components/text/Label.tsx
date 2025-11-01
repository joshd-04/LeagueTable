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
      className={`text-[0.875rem]/[1.4] md:text-[0.875rem]/[1.4] xl:text-[0.875rem]/[1.4]  ${
        className || ''
      }`}
      style={style}
    >
      {children}
    </p>
  );
}
