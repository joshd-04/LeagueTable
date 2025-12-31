'use client';

import { useEffect, useState } from 'react';

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function useScrollbarMargin(extra = 20) {
  const [marginRight, setMarginRight] = useState(0);

  useEffect(() => {
    const update = () => {
      setMarginRight(getScrollbarWidth() + extra);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [extra]);

  return marginRight;
}
