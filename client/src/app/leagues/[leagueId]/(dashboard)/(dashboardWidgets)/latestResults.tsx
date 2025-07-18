import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { League, Result } from '@/util/definitions';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { MouseEvent, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/util/config';
import { fetchAPI } from '@/util/api';

export default function LatestResults({
  league,
  seasonViewing = league.currentSeason,
}: {
  league: League;
  seasonViewing?: number;
}) {
  const [isHoveringOuterPanel, setIsHoveringOuterPanel] = useState(false);

  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/results?limit=3&season=${seasonViewing}`,
        {
          method: 'GET',
        }
      ),
    queryKey: ['results', seasonViewing],
  });

  const mostRecentResults: Result[] = data?.data.results.slice(0, 3);

  return (
    <motion.div
      className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 flex flex-col gap-1 hover:cursor-pointer"
      onMouseEnter={() => setIsHoveringOuterPanel(true)}
      onMouseLeave={() => setIsHoveringOuterPanel(false)}
      whileTap={{ scale: isHoveringOuterPanel ? 0.98 : 1 }}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/leagues/${league._id}/results`);
      }}
      style={{
        background: isHoveringOuterPanel ? 'var(--bg-light)' : 'var(--bg)',
        borderColor: isHoveringOuterPanel ? 'transparent' : 'var(--border)',
      }}
    >
      <span>
        <Paragraph
          style={{
            color: 'var(--text)',
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          Latest Results
        </Paragraph>
      </span>
      {isLoading ? (
        <>
          <ResultRowSkeleton />
          <ResultRowSkeleton />
          <ResultRowSkeleton />
        </>
      ) : mostRecentResults.length > 0 ? (
        mostRecentResults.map((result, i) => (
          <div
            key={i}
            onMouseEnter={() => setIsHoveringOuterPanel(false)}
            onMouseLeave={() => setIsHoveringOuterPanel(true)}
          >
            <ResultRow result={result} league={league} />
          </div>
        ))
      ) : (
        <Label
          style={{
            fontStyle: 'italic',
            placeSelf: 'center',
          }}
        >
          No results yet
        </Label>
      )}
    </motion.div>
  );
}

function ResultRow({ league, result }: { league: League; result: Result }) {
  const router = useRouter();

  function handleResultClick(e: MouseEvent) {
    e.stopPropagation();
    router.push(`/leagues/${league._id}/result/${result._id}`);
  }

  const homeGoals = result.basicOutcome.reduce(
    (acc, cur) => (cur === 'home' ? acc + 1 : acc),
    0
  );
  const awayGoals = result.basicOutcome.reduce(
    (acc, cur) => (cur === 'away' ? acc + 1 : acc),
    0
  );

  return (
    <motion.div
      className="bg-[var(--bg)] hover:bg-[var(--bg-light)] rounded-[10px] h-[36px] border-1 border-[var(--border)] hover:border-transparent hover:cursor-pointer flex flex-row justify-baseline items-center px-[10px]"
      onClick={(e) => handleResultClick(e)}
      whileTap={{ scale: 0.98 }}
    >
      <Label
        style={{
          width: 'max-content',
          height: 'min-content',
          flex: 'none',
        }}
      >
        MD {result.matchweek}
      </Label>
      <div className="grid grid-rows-1 grid-cols-[1fr_80px_1fr] flex-grow place-items-end">
        <Paragraph
          style={{
            width: '100%',
            textAlign: 'right',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {result.homeTeamDetails.name}
        </Paragraph>
        <Paragraph
          style={{
            width: '100%',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontWeight: 'normal',
          }}
        >
          {homeGoals} <span className="text-[var(--text-muted)]">-</span>{' '}
          {awayGoals}
        </Paragraph>
        <Paragraph
          style={{
            width: '100%',
            textAlign: 'left',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {result.awayTeamDetails.name}
        </Paragraph>
      </div>
      {/* {userOwnsThisLeague && (
        <Button
          color="transparent"
          bgHoverColor="var(--bg-dark)"
          borderlessButton={true}
          underlineEffect={false}
          shadowEffect={false}
          style={{ padding: '10px' }}
          onClick={(e) => {
            e.stopPropagation();
            setShowFixtureToResult(fixtureObj);
          }}
        >
          <EditSVG className="w-[16px] h-[16px] fill-[var(--text)]" />
        </Button>
      )} */}
    </motion.div>
  );
}

function ResultRowSkeleton() {
  return (
    <div className="bg-[var(--bg-light)] rounded-[10px] h-[36px] border-1 border-[var(--border)] flex flex-row justify-baseline items-center animate-pulse "></div>
  );
}
