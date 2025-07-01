import { CSSProperties } from 'react';

export default function ArrowBackSVG({
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
      <path d="M655-80 255-480l400-400 56 57-343 343 343 343-56 57Z" />
    </svg>
  );
}
