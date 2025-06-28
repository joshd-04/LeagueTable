import React, { CSSProperties } from 'react';

export default function Heading1({
  style,
  children,
}: {
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <h1
      className="font-[family-name:var(--font-instrument-sans)] font-bold text-[2.25rem] md:text-[3rem] xl:text-[4.5rem] text-[var(--text)]"
      style={style}
    >
      {children}
    </h1>
  );
}
