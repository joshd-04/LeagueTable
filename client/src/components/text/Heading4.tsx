import React, { CSSProperties } from 'react';

export default function Heading4({
  style,
  children,
}: {
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <h4
      className="font-[family-name:var(--font-instrument-sans)] font-normal text-[1.5rem] md:text-[1.75rem] xl:text-[2rem] text-[var(--text)]"
      style={style}
    >
      {children}
    </h4>
  );
}
