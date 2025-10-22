import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useContext,
} from 'react';
import Button from '@/components/text/Button';
import { GlobalContext } from '@/context/GlobalContextProvider';
import ArrowBackSVG from '@/assets/svg components/ArrowBack';
import ArrowForwardSVG from '@/assets/svg components/ArrowForward';
import Paragraph from '../text/Paragraph';
export default function Pagination({
  page,
  setPage,
  lastPage,
}: {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
}) {
  const [isTyping, setIsTyping] = useState(false);
  const [customInput, setCustomInput] = useState(page);

  useEffect(() => {
    if (!isTyping) setCustomInput(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // refs: inFlowRef is the pagination element in the normal document flow (the "resting" position).
  // fixedRef is the floating / fixed clone shown while scrolling.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inFlowRef = useRef<HTMLDivElement | null>(null);
  const fixedRef = useRef<HTMLDivElement | null>(null);
  const [stuck, setStuck] = useState(false);

  // how far from viewport bottom the floating element sits (in px).
  const FIXED_BOTTOM_PX = 60;
  const EPSILON = 0.5;

  // track scroll direction and previous stuck state so we can play an upward animation
  const lastScrollYRef = useRef(
    typeof window !== 'undefined' ? window.scrollY : 0
  );
  const scrollDirRef = useRef<'up' | 'down'>('down');
  const prevStuckRef = useRef(stuck);

  // compute stuck state: when the floating element (fixed bottom at window.innerHeight - FIXED_BOTTOM_PX)
  // would overlap the in-flow pagination's top, we consider it "docked" and show the in-flow element.
  // We do a synchronous check on mount (useLayoutEffect) to avoid one-frame flicker, and then rAF-throttled
  // scroll/resize updates for smoothness.
  useLayoutEffect(() => {
    const check = () => {
      const inFlowEl = inFlowRef.current;
      if (!inFlowEl) return;
      const rect = inFlowEl.getBoundingClientRect();
      // when the floating bottom passes the in-flow top -> overlap begins
      const shouldBeStuck =
        rect.top <= window.innerHeight - FIXED_BOTTOM_PX + EPSILON;

      // compute scroll direction
      const currentScrollY = window.scrollY;
      scrollDirRef.current =
        currentScrollY > lastScrollYRef.current ? 'down' : 'up';
      lastScrollYRef.current = currentScrollY;

      const prev = prevStuckRef.current;
      // If we are *releasing* from stuck -> not stuck and the user scrolled up,
      // play a controlled "unstick upwards" animation for the fixed clone.
      if (prev && !shouldBeStuck && scrollDirRef.current === 'up') {
        const el = fixedRef.current;
        if (el) {
          // prepare initial state (above & invisible) without transition
          el.style.transition = 'none';
          el.style.transform = 'translate(-50%,-8px)';
          el.style.opacity = '0';
          el.style.pointerEvents = 'auto';
          // force reflow
          el.getBoundingClientRect();
          // then animate into place
          el.style.transition =
            'transform 200ms ease-out, opacity 200ms ease-out';
          requestAnimationFrame(() => {
            el.style.transform = 'translate(-50%,0)';
            el.style.opacity = '1';
          });
        }
        setStuck(false);
        prevStuckRef.current = false;
        return;
      }

      // default update: only update state when it actually changes
      if (prev !== shouldBeStuck) {
        setStuck(shouldBeStuck);
        prevStuckRef.current = shouldBeStuck;
        // Ensure fixed element visual state matches the new stuck value.
        // When docking (shouldBeStuck === true) animate the fixed clone out (down + fade)
        // When becoming unstuck due to downward scroll, just ensure fixed clone is visible.
        const el = fixedRef.current;
        if (el) {
          el.style.transition =
            'transform 200ms ease-out, opacity 200ms ease-out';
          if (shouldBeStuck) {
            el.style.transform = 'translate(-50%,8px)';
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
          } else {
            // visible floating state
            el.style.transform = 'translate(-50%,0)';
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
          }
        }
      }
    };

    // initial synchronous check to avoid flicker
    check();

    let ticking = false;
    const handler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        check();
        ticking = false;
      });
    };

    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  const colorTheme = useContext(GlobalContext).colorTheme.colorTheme;

  // build the inner pagination content once so both fixed and in-flow share identical structure
  const PaginationContent = (
    <div
      className={`flex flex-row gap-1 place-self-center mt-8 z-50  p-4 rounded-[20px] ${
        stuck ? '' : colorTheme === 'light' ? 'bg-black/20' : 'bg-black/80'
      }`}
    >
      <div className="bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] hover:border-transparent">
        <Button
          color="var(--text)"
          bgHoverColor="var(--bg-light)"
          borderlessButton={true}
          underlineEffect={false}
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          style={{ padding: '5px 10px' }}
        >
          <ArrowBackSVG
            className={`w-[24px] h-[24px]`}
            style={{
              fill: page === 1 ? 'var(--border)' : 'var(--text)',
            }}
          />
        </Button>
      </div>
      <div className="flex flex-row gap-1">
        <div className="bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] hover:border-transparent">
          <Button
            color="var(--text)"
            bgHoverColor="var(--bg-light)"
            borderlessButton={true}
            underlineEffect={false}
            style={{ width: '100%' }}
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            1
          </Button>
        </div>

        <div
          className="rounded-[10px] border-1 relative h-full color-[var(--primary)]"
          style={{
            backgroundColor: 'var(--bg-light)',
            borderColor: isTyping ? 'var(--text-muted)' : 'var(--border)',
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              let newPage = customInput;
              if (customInput > lastPage) newPage = lastPage;
              else if (customInput < 1) newPage = 1;
              setPage(newPage);
              setIsTyping(false);
            }}
            className="h-full"
          >
            <Paragraph style={{ width: '100%', height: '100%' }}>
              {isTyping ? (
                <input
                  className="w-[4ch] h-full outline-none px-2 text-center align-middle
             [appearance:textfield] 
             [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none 
             "
                  type="number"
                  autoFocus={true}
                  onBlur={() => {
                    setIsTyping(false);
                    setCustomInput(page);
                  }}
                  value={customInput}
                  onChange={(e) => setCustomInput(Number(e.target.value))}
                />
              ) : (
                <Button
                  color="var(--primary)"
                  bgHoverColor="var(--accent)"
                  borderlessButton={true}
                  underlineEffect={false}
                  style={{ width: '100%', cursor: 'text' }}
                  onClick={() => setIsTyping(true)}
                >
                  {page}
                </Button>
              )}
            </Paragraph>
          </form>
        </div>

        <div className="bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] hover:border-transparent">
          <Button
            color="var(--text)"
            bgHoverColor="var(--bg-light)"
            borderlessButton={true}
            underlineEffect={false}
            style={{ width: '100%' }}
            onClick={() => setPage(lastPage)}
            disabled={page === lastPage}
          >
            {lastPage}
          </Button>
        </div>
      </div>
      <div className="bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] hover:border-transparent">
        <Button
          color="var(--text)"
          bgHoverColor="var(--bg-light)"
          borderlessButton={true}
          underlineEffect={false}
          disabled={page === lastPage}
          onClick={() => setPage((prev) => prev + 1)}
          style={{ padding: '5px 10px' }}
        >
          <ArrowForwardSVG
            className={`w-[24px] h-[24px]`}
            style={{
              fill: page === lastPage ? 'var(--border)' : 'var(--text)',
            }}
          />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative " ref={containerRef}>
      {/* In-flow pagination: stays in document flow where it should rest.
          When not stuck we keep it invisible (visibility:hidden) so it still
          reserves space and the layout is stable. When stuck is true it is visible. */}
      <div
        ref={inFlowRef}
        className={`w-full flex justify-center transition-all  duration-200 ease-out ${
          stuck
            ? 'visible opacity-100 translate-y-0'
            : 'invisible opacity-0 translate-y-2'
        }`}
      >
        {PaginationContent}
      </div>

      {/* Fixed floating clone: shown only while not stuck. It is visually identical.
          When it is shown the in-flow element is invisible but still occupies space. */}
      <div
        ref={fixedRef}
        // we keep the fixed clone in the DOM always and toggle visuals via opacity/transform
        className="fixed left-[50%] pointer-events-auto transition-all duration-200 ease-out"
        style={{
          zIndex: 60,
          // matching Tailwind bottom-20 (5rem). Use px to avoid dependence on Tailwind classes here.
          bottom: '60px',
          // inline transform includes translateX(-50%) plus a subtle translateY when hiding so transitions are smooth both ways
          transform: stuck
            ? 'translate(-50%, 8px) ' // slightly shifted down & invisible (docks into in-flow)
            : 'translate(-50%, 0)', // floating position
          opacity: stuck ? 0 : 1,
          pointerEvents: stuck ? 'none' : 'auto',
        }}
      >
        {PaginationContent}
      </div>
    </div>
  );
}
