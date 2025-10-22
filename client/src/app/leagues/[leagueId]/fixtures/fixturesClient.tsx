'use client';
import Paragraph from '@/components/text/Paragraph';
import { Fixture, League } from '@/util/definitions';
import Heading1 from '@/components/text/Heading1';
import Label from '@/components/text/Label';
import LinkButton from '@/components/text/LinkButton';
import TeamForm from '@/components/teamForm/TeamForm';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import Subtitle from '@/components/text/Subtitle';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
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
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/util/config';
import { fetchAPI } from '@/util/api';
import { GlobalContext } from '@/context/GlobalContextProvider';
import ArrowBackSVG from '@/assets/svg components/ArrowBack';
import ArrowForwardSVG from '@/assets/svg components/ArrowForward';

export default function FixturesClient({
  league,
  fixtures,
}: {
  league: League;
  fixtures: Fixture[];
}) {
  const router = useRouter();
  // 0 means all divsions, other numbers mean that specific division only
  const [divisionFilter, setDivisionFilter] = useState(0);
  // const [filteredFixtures, setFilteredFixtures]

  const [matchweekViewing, setMatchweekViewing] = useState(
    league.currentMatchweek
  );

  function handleClick(id: string) {
    router.push(`/leagues/${league._id}/fixture/${id}`);
  }

  const [displayedFixtures, setDisplayedFixtures] = useState(fixtures);

  let filteredFixtures: Fixture[] = [];

  if (divisionFilter === 0) {
    filteredFixtures = displayedFixtures;
  } else {
    filteredFixtures = displayedFixtures.filter(
      (fixture) => fixture.division === divisionFilter
    );
  }

  const { refetch: refetchFixtures } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/fixtures?matchweek=${matchweekViewing}`,
        {
          method: 'GET',
        }
      ),
    queryKey: ['fixtures'],

    enabled: false,
  });

  useEffect(() => {
    if (matchweekViewing < 1 || matchweekViewing > league.finalMatchweek)
      return;
    const fetchData = async () => {
      const { data } = await refetchFixtures();
      if (data.status === 'success') {
        setDisplayedFixtures(data.data.fixtures);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchweekViewing]);

  return (
    <div className="flex flex-col gap-[20px]">
      <LeagueBanner league={league}>
        <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
          <Heading1>Fixtures</Heading1>
        </div>
      </LeagueBanner>
      <div className="flex flex-col gap-[20px] mx-[20px]">
        <div className="grid  grid-rows-1 grid-cols-[1fr_auto_1fr] place-items-center gap-12">
          <Paragraph style={{ justifySelf: 'end' }}>
            Season {league.currentSeason} Matchweek {league.currentMatchweek}
          </Paragraph>
          <LinkButton
            color="var(--text)"
            bgHoverColor="var(--bg)"
            borderlessButton={true}
            underlineEffect={false}
            href={`/leagues/${league._id}`}
          >
            {league.name}
          </LinkButton>
          <Paragraph style={{ justifySelf: 'start' }}>
            <select
              className="bg-[var(--bg)] hover:bg-[var(--bg-light)] p-2 rounded-[10px] outline-none cursor-pointer"
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(+e.target.value)}
            >
              <option value={0}>All fixtures</option>
              {league.tables
                .filter((table) => table.season === league.currentSeason)
                .map((table, i) => (
                  <option value={table.division} key={i}>
                    {table.name}
                  </option>
                ))}
            </select>
          </Paragraph>
        </div>
      </div>
      <div className="w-[50%] place-self-center">
        <div className="flex flex-col gap-[20px]">
          <div>
            <Label
              style={{
                fontWeight: 'bold',
                marginBottom: '10px',
                placeSelf: 'center',
              }}
            >
              Matchweek {matchweekViewing}{' '}
              {+matchweekViewing > league.currentMatchweek && '(future)'}
            </Label>

            <div className="flex flex-col gap-[10px]">
              {filteredFixtures.map((fixture, i) =>
                +matchweekViewing > league.currentMatchweek ? (
                  <FixtureRowFuture fixture={fixture} key={i} />
                ) : (
                  <FixtureRow
                    fixture={fixture}
                    key={i}
                    handleClick={handleClick}
                  />
                )
              )}
            </div>
          </div>
        </div>

        <Pagination
          matchweekViewing={matchweekViewing}
          setMatchweekViewing={setMatchweekViewing}
          league={league}
        />
      </div>
    </div>
  );
}

function FixtureRow({
  fixture,
  handleClick,
}: {
  fixture: Fixture;
  handleClick: (id: string) => void;
}) {
  const homePoints =
    fixture.homeTeamDetails.wins * 3 + fixture.homeTeamDetails.draws;
  const awayPoints =
    fixture.awayTeamDetails.wins * 3 + fixture.awayTeamDetails.draws;
  return (
    <motion.div
      className="bg-[var(--bg)] w-full border-1 border-[var(--border)] rounded-[10px] p-[10px] grid grid-rows-1 grid-cols-[1fr_auto_1fr] gap-[20px] items-baseline hover:bg-[var(--bg-light)] hover:cursor-pointer hover:border-transparent"
      whileTap={{ scale: 0.98 }}
      onClick={() => handleClick(fixture._id)}
    >
      <div className="grid grid-rows-1 grid-cols-[1fr_6ch_160px] gap-[20px] items-baseline justify-items-end">
        <TeamForm form={fixture.homeTeamDetails.form} />
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {homePoints} pt{homePoints === 1 ? '' : 's'}
        </Paragraph>
        <Subtitle
          style={{
            textAlign: 'right',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          {fixture.homeTeamDetails.name}
        </Subtitle>
      </div>
      <Label style={{ fontWeight: 'bold', textAlign: 'center' }}>vs</Label>

      <div className="grid grid-rows-1 grid-cols-[160px_6ch_1fr] gap-[20px] items-baseline">
        <Subtitle
          style={{
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {fixture.awayTeamDetails.name}
        </Subtitle>
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {awayPoints} pt{awayPoints === 1 ? '' : 's'}
        </Paragraph>
        <TeamForm form={fixture.awayTeamDetails.form} />
      </div>
    </motion.div>
  );
}

function FixtureRowFuture({ fixture }: { fixture: Fixture }) {
  const homePoints =
    fixture.homeTeamDetails.wins * 3 + fixture.homeTeamDetails.draws;
  const awayPoints =
    fixture.awayTeamDetails.wins * 3 + fixture.awayTeamDetails.draws;
  return (
    <div className="bg-[var(--bg)] w-full border-1 border-[var(--border)] rounded-[10px] p-[10px] grid grid-rows-1 grid-cols-[1fr_auto_1fr] gap-[20px] items-baseline brightness-80">
      <div className="grid grid-rows-1 grid-cols-[1fr_6ch_160px] gap-[20px] items-baseline justify-items-end">
        <TeamForm form={fixture.homeTeamDetails.form} />
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {homePoints} pt{homePoints === 1 ? '' : 's'}
        </Paragraph>
        <Subtitle
          style={{
            color: 'var(--text-muted)',
            textAlign: 'right',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          {fixture.homeTeamDetails.name}
        </Subtitle>
      </div>
      <Label style={{ fontWeight: 'bold', textAlign: 'center' }}>vs</Label>

      <div className="grid grid-rows-1 grid-cols-[160px_6ch_1fr] gap-[20px] items-baseline">
        <Subtitle
          style={{
            color: 'var(--text-muted)',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {fixture.awayTeamDetails.name}
        </Subtitle>
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {awayPoints} pt{awayPoints === 1 ? '' : 's'}
        </Paragraph>
        <TeamForm form={fixture.awayTeamDetails.form} />
      </div>
    </div>
  );
}

function Pagination({
  matchweekViewing,
  setMatchweekViewing,
  league,
}: {
  matchweekViewing: number;
  setMatchweekViewing: Dispatch<SetStateAction<number>>;
  league: League;
}) {
  const [isTyping, setIsTyping] = useState(false);
  const [customInput, setCustomInput] = useState(matchweekViewing);

  useEffect(() => {
    if (!isTyping) setCustomInput(matchweekViewing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchweekViewing]);

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
          disabled={matchweekViewing === 1}
          onClick={() => setMatchweekViewing((prev) => prev - 1)}
          style={{ padding: '5px 10px' }}
        >
          <ArrowBackSVG
            className={`w-[24px] h-[24px]`}
            style={{
              fill: matchweekViewing === 1 ? 'var(--border)' : 'var(--text)',
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
            onClick={() => setMatchweekViewing(1)}
            disabled={matchweekViewing === 1}
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
              setMatchweekViewing(customInput);
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
                    setCustomInput(matchweekViewing);
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
                  {matchweekViewing}
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
            onClick={() => setMatchweekViewing(league.finalMatchweek)}
            disabled={matchweekViewing === league.finalMatchweek}
          >
            {league.finalMatchweek}
          </Button>
        </div>
      </div>
      <div className="bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] hover:border-transparent">
        <Button
          color="var(--text)"
          bgHoverColor="var(--bg-light)"
          borderlessButton={true}
          underlineEffect={false}
          disabled={matchweekViewing === league.finalMatchweek}
          onClick={() => setMatchweekViewing((prev) => prev + 1)}
          style={{ padding: '5px 10px' }}
        >
          <ArrowForwardSVG
            className={`w-[24px] h-[24px]`}
            style={{
              fill:
                matchweekViewing === league.finalMatchweek
                  ? 'var(--border)'
                  : 'var(--text)',
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
