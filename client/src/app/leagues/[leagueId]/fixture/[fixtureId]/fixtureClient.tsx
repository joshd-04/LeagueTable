'use client';
import { GlobalContext } from '@/context/GlobalContextProvider';
import useAccount from '@/hooks/useAccount';
import { Fixture, League } from '@/util/definitions';
import { useContext, useEffect, useState } from 'react';
import Heading1 from '@/components/text/Heading1';

import LinkButton from '@/components/text/LinkButton';
import Button from '@/components/text/Button';
import FixtureToResult from '@/components/fixtureToResult/FixtureToResult';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import MatchPreview from './(widgets)/matchPreview';
import HeadToHead from './(widgets)/headToHead';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';

export default function FixtureClient({
  league,
  fixture,
}: {
  league: League;
  fixture: Fixture;
}) {
  const context = useContext(GlobalContext);
  const { user } = context.account;
  const { isLoggedIn } = useAccount();

  console.log(league.results.includes(fixture._id));

  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);

  const { data: fixtureResultStatusData, isLoading } = useQuery({
    queryFn: () => {
      return fetchAPI(
        `${API_URL}/leagues/${league._id}/fixture-result-status/${fixture._id}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
    },
    queryKey: ['fixture-result-status'],
    refetchOnMount: true,
  });

  useEffect(() => {
    if (!isLoading) {
      if (fixtureResultStatusData.status === 'success') {
        const { isFixture, isResult } = fixtureResultStatusData.data;
        if (isResult) {
          router.push(`/leagues/${league._id}/result/${fixture._id}`);
        } else if (isFixture) {
          // do nothing
        } else {
          router.push(`/leagues/${league._id}`);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixtureResultStatusData]);

  const {
    isOpen: isFixtureToResultOpen,
    onOpen: onFixtureToResultOpen,
    onClose: onFixtureToResultClose,
  } = useDisclosure();

  let userOwnsThisLeague = false;
  if (isLoggedIn && user !== undefined && user !== null) {
    if (user.id === league.leagueOwner._id) {
      userOwnsThisLeague = true;
    }
  }
  const router = useRouter();

  function handleFixtureToResultCompletion(isSuccess: boolean) {
    if (isSuccess) {
      router.push(`/leagues/${league._id}/result/${fixture._id}`);
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <LeagueBanner league={league}>
        <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
          <div
            className={`w-full ${
              fixture.neutralGround ? 'hidden' : 'flex'
            } flex-row justify-between mb-[-20px] `}
          >
            <p className="text-sm">Home</p>
            <p className="text-sm">Away</p>
          </div>
          <div className="flex flex-row justify-between gap-[20px]">
            <LinkButton
              color="var(--text)"
              bgHoverColor="transparent"
              borderlessButton={true}
              underlineEffect={true}
              shadowEffect={false}
              href={'/'}
              style={{ padding: 0, width: 'max-content' }}
            >
              <Heading1>{fixture.homeTeamDetails.name}</Heading1>
            </LinkButton>
            <Heading1> v </Heading1>
            <LinkButton
              color="var(--text)"
              bgHoverColor="transparent"
              borderlessButton={true}
              underlineEffect={true}
              shadowEffect={false}
              href={'/'}
              style={{ padding: 0, width: 'max-content' }}
            >
              <Heading1>{fixture.awayTeamDetails.name}</Heading1>
            </LinkButton>
          </div>
        </div>
      </LeagueBanner>
      <div className="flex flex-col items-center gap-[20px] mx-[20px]">
        <div className="grid grid-rows-1 grid-cols-[1fr_auto_1fr] place-items-center gap-12">
          <p className="justify-self-end text-base">
            Season {fixture.season} Matchweek {fixture.matchweek}
          </p>
          <LinkButton
            color="var(--text)"
            bgHoverColor="var(--bg)"
            borderlessButton={true}
            underlineEffect={false}
            href={`/leagues/${league._id}`}
          >
            {league.name}
          </LinkButton>
          <div className="flex flex-row items-center justify-start gap-12 text-base">
            <p>
              {league.tables[fixture.division - 1].name} (div {fixture.division}
              )
            </p>
            {fixture.neutralGround && <p>Neutral Ground</p>}
            {userOwnsThisLeague && (
              <Button
                color="var(--primary)"
                bgHoverColor="var(--accent)"
                borderlessButton={true}
                underlineEffect={false}
                onClick={() => {
                  setSelectedFixture(fixture);
                  onFixtureToResultOpen();
                }}
              >
                Upload result
              </Button>
            )}
          </div>
        </div>
        <div className="w-full grid grid-cols-3 grid-rows-[repeat(3,min-content)] gap-[20px]">
          <div className="p-[20px]  h-full w-full  bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
            <p className="text-base">AI insights</p>
          </div>
          <MatchPreview fixture={fixture} />
          <HeadToHead
            fixture={fixture}
            league={league}
            userOwnsThisLeague={userOwnsThisLeague}
          />
        </div>
        <FixtureToResult
          leagueType={league.leagueType}
          fixtureObj={selectedFixture}
          isModalOpen={isFixtureToResultOpen}
          onModalClose={onFixtureToResultClose}
          setSelectedFixture={setSelectedFixture}
          onResolution={handleFixtureToResultCompletion}
        />
      </div>
    </div>
  );
}
