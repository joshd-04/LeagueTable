import { League, Result } from '@/util/definitions';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { MouseEvent, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/util/config';
import { fetchAPI } from '@/util/api';
import { Card, CardBody } from '@heroui/react';

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
    queryKey: ['results', league._id, seasonViewing],
  });

  const mostRecentResults: Result[] = data?.data.results.slice(0, 3);

  function handleCardClick() {
    router.push(`/leagues/${league._id}/results?season=${seasonViewing}`);
  }

  return (
    <Card
      className={`px-[10px] py-[6px] h-full w-full ${
        !isHoveringOuterPanel ? 'data-[pressed=true]:scale-100' : ''
      }`}
      onMouseEnter={() => setIsHoveringOuterPanel(true)}
      onMouseLeave={() => setIsHoveringOuterPanel(false)}
      isPressable
      onClick={(e) => {
        e.stopPropagation();
        handleCardClick();
      }}
      style={{
        background: isHoveringOuterPanel
          ? 'hsl(var(--heroui-content3)/1)'
          : 'hsl(var(--heroui-content1)/1)',
      }}
    >
      <CardBody className="flex flex-col gap-2">
        <span>
          <p className="align-middle inline text-base">Latest Results</p>
        </span>
        {isLoading ? (
          <div>
            <ResultRowSkeleton />
            <ResultRowSkeleton />
            <ResultRowSkeleton />
          </div>
        ) : mostRecentResults.length > 0 ? (
          <div className="flex flex-col gap-1">
            {mostRecentResults.map((result, i) => (
              <div
                key={i}
                onMouseEnter={() => setIsHoveringOuterPanel(false)}
                onMouseLeave={() => setIsHoveringOuterPanel(true)}
              >
                <ResultRow result={result} league={league} />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center">
            <p className="italic place-self-center text-sm text-muted align-middle pb-6">
              No results yet
            </p>
          </div>
        )}
      </CardBody>
    </Card>
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
      className="bg-content2 hover:bg-content3 h-[36px] border-0 border-divider  flex flex-row justify-baseline items-center rounded-[10px] hover:cursor-pointer transition-colors duration-250"
      onClick={(e) => handleResultClick(e)}
      whileTap={{ scale: 0.98 }}
    >
      <p className="flex-none w-max h-min text-sm px-[10px]">
        MD {result.matchweek}
      </p>
      <div className="grid grid-rows-1 grid-cols-[1fr_80px_1fr] flex-grow place-items-end text-base">
        <p className="w-full text-right text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {result.homeTeamDetails.name}
        </p>
        <p className="w-full text-center font-normal text-muted">
          {homeGoals} <span className="text-muted">-</span> {awayGoals}
        </p>
        <p className="w-full text-left text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {result.awayTeamDetails.name}
        </p>
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

  return (
    <div
      className="bg-content2 hover:bg-content3 h-[36px] border-0 border-divider  flex flex-row justify-baseline items-center px-[10px]"
      onClick={(e) => handleResultClick(e)}
      role="button"
    >
      <p className="flex-none w-max h-min text-sm">MD {result.matchweek}</p>
      <div className="grid grid-rows-1 grid-cols-[1fr_80px_1fr] flex-grow place-items-end text-base">
        <p className="w-full text-right text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {result.homeTeamDetails.name}
        </p>
        <p className="w-full text-center font-normal text-muted">
          {homeGoals} <span className="text-muted">-</span> {awayGoals}
        </p>
        <p className="w-full text-left text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {result.awayTeamDetails.name}
        </p>
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
    </div>
  );
}

function ResultRowSkeleton() {
  return (
    <div className="bg-[var(--bg-light)] rounded-[10px] h-[36px] border-1 border-[var(--border)] flex flex-row justify-baseline items-center animate-pulse "></div>
  );
}
