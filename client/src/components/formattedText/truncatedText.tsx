import { Tooltip, TooltipProps } from '@heroui/react';
import { ReactNode, useEffect, useRef, useState } from 'react';

type TruncatedNameProps = TooltipProps & {
  textClassName?: string;
  children: ReactNode;
};

export default function TruncatedText({
  textClassName,
  children,
  ...tooltipProps
}: TruncatedNameProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setIsTruncated(el.scrollWidth > el.clientWidth);
  }, [children]);

  const text = (
    <p ref={ref} className={textClassName}>
      {children}
    </p>
  );

  return isTruncated ? <Tooltip {...tooltipProps}>{text}</Tooltip> : text;
}
