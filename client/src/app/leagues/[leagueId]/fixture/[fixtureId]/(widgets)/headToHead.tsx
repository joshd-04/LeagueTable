'use client';

import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { Fixture, League, Result } from '@/util/definitions';
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
  return (
    <div className="p-[20px]  h-full w-full  bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <p className="text-medium">Head-to-head record</p>
      {league.leagueLevel === 'free' ? (
        <HeadToHeadLocked userOwnsThisLeague={userOwnsThisLeague} />
      ) : (
        <HeadToHeadBody fixture={fixture} league={league} />
      )}
    </div>
  );
}

function HeadToHeadLocked({
  userOwnsThisLeague,
}: {
  userOwnsThisLeague: boolean;
}) {
  if (userOwnsThisLeague) {
    return (
      <div className="text-small">
        <p className="text-warning">
          Head-to-head is not available for free leagues.
        </p>
        <p>Upgrade to standard level to unlock.</p>
      </div>
    );
  }

  return (
    <div className="text-small">
      <p>Head-to-head is not available for this league.</p>
    </div>
  );
}

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
        <p className="text-small">Loading...</p>
      ) : results.length > 0 ? (
        <>
          <p className="text-small">Last 5 meetings:</p>
          <div>
            <div className="w-[70%] flex flex-col gap-1">
              {results.map((result, i) => (
                <ResultRow league={league} result={result} key={i} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-small">No history found</p>
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
      <p className="text-small w-max h-min flex-none">Season {result.season}</p>
      <div className="grid grid-rows-1 grid-cols-[1fr_80px_1fr] flex-grow place-items-end">
        <p className="text-medium w-full text-right text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {result.homeTeamDetails.name}
        </p>
        <p className="text-medium w-full text-center">
          {homeGoals} <span className="text-[var(--text-muted)]">-</span>{' '}
          {awayGoals}
        </p>
        <p className="text-medium w-full text-left text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {result.awayTeamDetails.name}
        </p>
      </div>
    </motion.div>
  );
}
