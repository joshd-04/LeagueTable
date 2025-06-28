import React, { CSSProperties } from 'react';

export default function Paragraph({
  style,
  children,
}: {
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <p
      className="font-[family-name:var(--font-instrument-sans)] font-normal text-[1rem] md:text-[1.125rem] xl:text-[1.25rem] text-[var(--text)]"
      style={style}
    >
      {children}
    </p>
  );
}
