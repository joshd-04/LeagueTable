'use client';

import ProChip from '@/components/chips/ProChip';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League } from '@/util/definitions';
import { HeadToHeadDTO, SingleResultDTO } from '@/util/dto/results';
import { meetsMinimumTierLevel } from '@/util/helpers';
import { Card, CardBody } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';

export default function HeadToHead({
  teams,
  league,
  userOwnsThisLeague,
}: {
  teams: { home: string; away: string };
  league: League;
  userOwnsThisLeague: boolean;
}) {
  const shouldShowHeadToHead = meetsMinimumTierLevel(
    'pro',
    league.leagueOwner.accountType,
  );
  // const shouldShowHeadToHead = false;

  return (
    <Card className="h-full w-full px-[10px] py-[6px]">
      <CardBody className="flex flex-col gap-4">
        {/* <p className="text-base">Head-to-head record</p> */}
        <span className="flex flex-row gap-2 items-center">
          <ProChip />
          <p className="align-middle inline text-base">Head-to-head record</p>
        </span>
        {shouldShowHeadToHead ? (
          <HeadToHeadBody teams={teams} league={league} />
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
      <div className="text-sm flex flex-col gap-2">
        <p className="text-warning">
          Head-to-head is currently disabled for your league.
        </p>
        <p className="">
          Upgrade your account to pro level to instantly unlock H2H for this
          league.
        </p>
        <p className="text-default-500"> Only you can see this message.</p>
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
  teams,
}: {
  league: League;
  teams: { home: string; away: string };
}) {
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/headtohead/${encodeURIComponent(
          teams.home,
        )}/${encodeURIComponent(teams.away)}`,
        { method: 'GET' },
      ),
    queryKey: ['headtohead', league._id, teams.home, teams.away],
  });

  const resultsData: HeadToHeadDTO | undefined = data?.data;
  const results = resultsData?.headtohead;
  return (
    <div>
      {isLoading || !results ? (
        <p className="text-sm">Loading...</p>
      ) : results.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div>
            <div className="w-full flex flex-col gap-1 max-h-[300px] overflow-auto">
              {results.map((result, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <ResultRow league={league} resultDTO={result} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm">No history found</p>
      )}
    </div>
  );
}

function ResultRow({
  league,
  resultDTO,
}: {
  league: League;
  resultDTO: SingleResultDTO;
}) {
  const router = useRouter();
  const result = resultDTO.result;

  function handleResultClick(e: MouseEvent) {
    e.stopPropagation();
    router.push(`/leagues/${league._id}/result/${result._id}`);
  }

  const homeGoals = result.basicOutcome.reduce(
    (acc, cur) => (cur === 'home' ? acc + 1 : acc),
    0,
  );
  const awayGoals = result.basicOutcome.reduce(
    (acc, cur) => (cur === 'away' ? acc + 1 : acc),
    0,
  );

  return (
    // <motion.div
    //   className="bg-[var(--bg)] hover:bg-[var(--bg-light)] rounded-[10px] h-[36px] border-1 border-[var(--border)] hover:border-transparent hover:cursor-pointer flex flex-row justify-baseline items-center px-[10px]"
    //   onClick={(e) => handleResultClick(e)}
    //   whileTap={{ scale: 0.98 }}
    // >
    //   <p className="text-sm w-max h-min flex-none">Season {result.season}</p>
    //   <div className="grid grid-rows-1 grid-cols-[1fr_80px_1fr] flex-grow place-items-end">
    //     <p className="text-base w-full text-right text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
    //       {result.homeTeamDetails.name}
    //     </p>
    //     <p className="text-base w-full text-center">
    //       {homeGoals} <span className="text-muted">-</span> {awayGoals}
    //     </p>
    //     <p className="text-base w-full text-left text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
    //       {result.awayTeamDetails.name}
    //     </p>
    //   </div>
    // </motion.div>
    <motion.div
      className="bg-content2 hover:bg-content3 h-[36px] border-0 border-divider  flex flex-row justify-baseline items-center rounded-[10px] hover:cursor-pointer transition-colors duration-250"
      onClick={(e) => handleResultClick(e)}
      whileTap={{ scale: 0.98 }}
    >
      <p className="flex-none w-max h-min text-sm px-[10px]">
        Season {result.season}
      </p>
      <div className="grid grid-rows-1 grid-cols-[1fr_80px_1fr] flex-grow place-items-end text-base">
        <p className="w-full text-right text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {resultDTO.homeDetails.name}
        </p>
        <p className="w-full text-center font-normal text-muted">
          {homeGoals} <span className="text-muted">-</span> {awayGoals}
        </p>
        <p className="w-full text-left text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {resultDTO.awayDetails.name}
        </p>
      </div>
    </motion.div>
  );
}
