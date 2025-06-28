import React, { CSSProperties } from 'react';

export default function Subtitle({
  style,
  children,
}: {
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <span
      className="font-[family-name:var(--font-instrument-sans)] font-normal text-[1.125rem] md:text-[1.25rem] xl:text-[1.5rem] text-[var(--text)]"
      style={style}
    >
      {children}
    </span>
  );
}
