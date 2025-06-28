import React, { CSSProperties } from 'react';

export default function Heading2({
  style,
  children,
}: {
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <h2
      className="font-[family-name:var(--font-instrument-sans)] font-semibold text-[2rem] md:text-[2.5rem] xl:text-[3.5rem] text-[var(--text)]"
      style={style}
    >
      {children}
    </h2>
  );
}
