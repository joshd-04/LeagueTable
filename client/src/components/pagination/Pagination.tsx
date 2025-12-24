import {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useLayoutEffect,
  useContext,
} from 'react';
import { Pagination } from '@heroui/react';
import { GlobalContext } from '@/context/GlobalContextProvider';

export default function PaginationComponent({
  page,
  setPage,
  lastPage,
}: {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
}) {
  const inFlowRef = useRef<HTMLDivElement | null>(null);
  const fixedRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const isStickyRef = useRef(false);

  const FIXED_BOTTOM_PX = 60;
  const THRESHOLD = 20;

  useLayoutEffect(() => {
    const checkStickyState = () => {
      const inFlowEl = inFlowRef.current;
      if (!inFlowEl) return;

      const rect = inFlowEl.getBoundingClientRect();
      const stickyTop = window.innerHeight - FIXED_BOTTOM_PX;

      const shouldBeSticky = rect.top > stickyTop + THRESHOLD;

      if (isStickyRef.current !== shouldBeSticky) {
        isStickyRef.current = shouldBeSticky;
        setIsSticky(shouldBeSticky);
      }
    };

    checkStickyState();

    const handleScroll = () => {
      requestAnimationFrame(checkStickyState);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const colorTheme = useContext(GlobalContext).colorTheme.colorTheme;

  const PaginationContent = (
    <Pagination
      color="primary"
      page={page}
      total={lastPage}
      onChange={setPage}
      showControls
      classNames={{
        next: 'cursor-pointer',
        prev: 'cursor-pointer',
        item: 'cursor-pointer',
      }}
    />
  );

  return (
    <div className="relative">
      {/* Normal position - always reserves space in layout */}
      <div
        ref={inFlowRef}
        className={`w-full flex justify-center mt-8 transition-opacity duration-200 ${
          isSticky ? 'opacity-0 invisible' : 'opacity-100 visible'
        }`}
      >
        {PaginationContent}
      </div>

      {/* Sticky position - fixed to bottom of viewport */}
      <div
        ref={fixedRef}
        className={`fixed left-1/2 -translate-x-1/2 transition-all duration-200 ${
          isSticky
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        style={{
          bottom: `${FIXED_BOTTOM_PX}px`,
          zIndex: 60,
        }}
      >
        <div
          className={`p-4 rounded-[20px] place-items-center ${
            isSticky
              ? colorTheme === 'light'
                ? 'bg-black/20'
                : 'bg-black/80'
              : ''
          }`}
        >
          {PaginationContent}
        </div>
      </div>
    </div>
  );
}
