import React, { CSSProperties } from 'react';

export default function Heading3({
  style,
  children,
}: {
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <h3
      className="font-[family-name:var(--font-instrument-sans)] font-normal text-[1.75rem] md:text-[2rem] xl:text-[2.75rem] text-[var(--text)]"
      style={style}
    >
      {children}
    </h3>
  );
}
