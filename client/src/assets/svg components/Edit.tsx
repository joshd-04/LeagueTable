import { CSSProperties } from 'react';

export default function EditSVG({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48px"
      viewBox="0 -960 960 960"
      width="48px"
      fill="#0"
      className={className}
      style={style}
    >
      <path d="M120-120v-128l575-574q8-8 19-12.5t23-4.5q11 0 22 4.5t20 12.5l44 44q9 9 13 20t4 22q0 11-4.5 22.5T823-694L248-120H120Zm619-577 40-40-41-41-40 40 41 41Z" />
    </svg>
  );
}
