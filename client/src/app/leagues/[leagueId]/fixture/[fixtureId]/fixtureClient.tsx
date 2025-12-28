'use client';
import useAccount from '@/hooks/useAccount';
import { Fixture, League } from '@/util/definitions';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Heading1 from '@/components/text/Heading1';

import LinkButton from '@/components/text/LinkButton';
import FixtureToResult from '@/components/fixtureToResult/FixtureToResult';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import MatchPreview from './(widgets)/matchPreview';
import HeadToHead from './(widgets)/headToHead';
import { useRouter } from 'next/navigation';
import { addToast, Button, Link, useDisclosure } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import AiInsights from './(widgets)/aiInsights';
import { useScrollbarMargin } from '@/hooks/useScrollbarMargin';

export default function FixtureClient({
  league,
  fixture,
}: {
  league: League;
  fixture: Fixture;
}) {
  const { user, isLoggedIn } = useAccount();

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
  const mr = useScrollbarMargin(20);

  function handleFixtureToResultCompletion(isSuccess: boolean) {
    if (isSuccess) {
      router.push(`/leagues/${league._id}/result/${fixture._id}`);
    } else {
      addToast({
        title: 'Something went wrong',
        description: 'Could not convert this fixture into a result',
        color: 'warning',
      });
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <LeagueBanner leagueLevel={league.leagueLevel}>
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
      <div
        className="flex flex-col gap-5 mx-5 mb-5"
        style={{ marginRight: `${mr}px` }}
      >
        <DetailsRibbon
          league={league}
          fixture={fixture}
          setSelectedFixture={setSelectedFixture}
          onFixtureToResultOpen={onFixtureToResultOpen}
        />
        <div className="w-full grid grid-cols-3 grid-rows-[repeat(3,min-content)] gap-5 ">
          <AiInsights league={league} fixture={fixture} />
          <MatchPreview league={league} fixture={fixture} />
          <HeadToHead
            fixture={fixture}
            league={league}
            userOwnsThisLeague={userOwnsThisLeague}
          />
        </div>
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
  );
}

function DetailsRibbon({
  league,
  fixture,
  setSelectedFixture,
  onFixtureToResultOpen,
}: {
  league: League;
  fixture: Fixture;
  setSelectedFixture: Dispatch<SetStateAction<Fixture | null>>;
  onFixtureToResultOpen: () => void;
}) {
  return (
    <div className="grid grid-rows-1 grid-cols-3 place-self-center place-items-center text-base">
      <p className="justify-self-end">
        Season {league.currentSeason} Matchweek {league.currentMatchweek}
      </p>

      <Button as={Link} href={`/leagues/${league._id}`} variant="flat">
        {league.name}
      </Button>
      <Button
        // variant="bordered"
        color="primary"
        className="font-semibold justify-self-start"
        onPress={() => {
          setSelectedFixture(fixture);
          onFixtureToResultOpen();
        }}
      >
        Upload result
      </Button>
    </div>
  );
}
