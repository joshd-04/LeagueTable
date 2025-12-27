'use client';

import ProChip from '@/components/chips/ProChip';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { Fixture, League, Result } from '@/util/definitions';
import { meetsMinimumTierLevel } from '@/util/helpers';
import { Card, CardBody } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';

export default function HeadToHead({
  fixture,
  league,
  userOwnsThisLeague,
}: {
  fixture: Fixture;
  league: League;
  userOwnsThisLeague: boolean;
}) {
  const shouldShowHeadToHead = meetsMinimumTierLevel(
    'pro',
    league.leagueOwner.accountType
  );
  // const shouldShowHeadToHead = true;

  return (
    <Card className="h-full w-full px-[10px] py-[6px]">
      <CardBody className="flex flex-col gap-2">
        {/* <p className="text-base">Head-to-head record</p> */}
        <span className="flex flex-row gap-2 items-center">
          <ProChip />
          <p className="align-middle inline text-base">Head-to-head record</p>
        </span>
        {shouldShowHeadToHead ? (
          <HeadToHeadBody fixture={fixture} league={league} />
        ) : (
          <HeadToHeadLocked userOwnsThisLeague={userOwnsThisLeague} />
        )}
      </CardBody>
    </Card>
  );
}

function HeadToHeadLocked({
  userOwnsThisLeague,
}: {
  userOwnsThisLeague: boolean;
}) {
  if (userOwnsThisLeague) {
    return (
      <div className="text-sm">
        <p className="text-warning">
          Head-to-head is currently disabled for your league.
        </p>
        <p>
          Upgrade your account to pro level to unlock H2H for this league
          instantly. Only you can see this message.
        </p>
      </div>
    );
  }

  return (
    <div className="text-sm">
      <p>Head-to-head is not available for this league.</p>
    </div>
  );
}
/**
 *
 * Note: Only render this component when you are sure the league is atleast pro level & league owner is atleast pro.
 *
 */
function HeadToHeadBody({
  league,
  fixture,
}: {
  league: League;
  fixture: Fixture;
}) {
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/headtohead/${encodeURIComponent(
          fixture.homeTeamDetails.name
        )}/${encodeURIComponent(fixture.awayTeamDetails.name)}`,
        { method: 'GET' }
      ),
    queryKey: ['headtohead'],
  });

  const results: Result[] = data?.data.lastFiveResults;
  return (
    <div>
      {isLoading ? (
        <p className="text-sm">Loading...</p>
      ) : results.length > 0 ? (
        <>
          <p className="text-sm">Last 5 meetings:</p>
          <div>
            <div className="w-[70%] flex flex-col gap-1">
              {results.map((result, i) => (
                <ResultRow league={league} result={result} key={i} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm">No history found</p>
      )}
    </div>
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
      <p className="text-sm w-max h-min flex-none">Season {result.season}</p>
      <div className="grid grid-rows-1 grid-cols-[1fr_80px_1fr] flex-grow place-items-end">
        <p className="text-base w-full text-right text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {result.homeTeamDetails.name}
        </p>
        <p className="text-base w-full text-center">
          {homeGoals} <span className="text-muted">-</span> {awayGoals}
        </p>
        <p className="text-base w-full text-left text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {result.awayTeamDetails.name}
        </p>
      </div>
    </motion.div>
  );
}
