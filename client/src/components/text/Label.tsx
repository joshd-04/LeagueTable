import React, { CSSProperties } from 'react';

export default function Label({
  style,
  children,
}: {
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <p
      className="font-[family-name:var(--font-instrument-sans)] font-bold text-[0.875rem] md:text-[0.875rem] xl:text-[1rem] text-[var(--text)]"
      style={style}
    >
      {children}
    </p>
  );
}
