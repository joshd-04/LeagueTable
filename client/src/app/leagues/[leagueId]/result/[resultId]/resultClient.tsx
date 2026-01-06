'use client';
import useAccount from '@/hooks/useAccount';
import { League, Result } from '@/util/definitions';
import Heading1 from '@/components/text/Heading1';

import LinkButton from '@/components/text/LinkButton';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import MatchOutcome from './(resultWidgets)/matchOutcome';
import AsItStood from './(resultWidgets)/asItStood';
import { individualTeamPagesEnabled } from '@/util/featureToggle';
import { Button, Link } from '@heroui/react';
import { useScrollbarMargin } from '@/hooks/useScrollbarMargin';
import HeadToHead from '../../fixture/[fixtureId]/(widgets)/headToHead';

export default function ResultClient({
  league,
  result,
}: {
  league: League;
  result: Result;
}) {
  const { user, isLoggedIn } = useAccount();
  const mr = useScrollbarMargin(20);

  const homeGoals = result.basicOutcome.reduce(
    (acc, team) => (team === 'home' ? acc + 1 : acc),
    0
  );
  const awayGoals = result.basicOutcome.reduce(
    (acc, team) => (team === 'away' ? acc + 1 : acc),
    0
  );

  // so the user can edit the result
  let userOwnsThisLeague = false;
  if (isLoggedIn && user !== undefined && user !== null) {
    if (user.id === league.leagueOwner._id) {
      userOwnsThisLeague = true;
      console.log('user owns this league: ', userOwnsThisLeague);
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <LeagueBanner leagueLevel={league.leagueLevel}>
        <div className="absolute bottom-0 left-[50%] translate-x-[-50%] w-max">
          <div
            className={`w-full ${
              result.neutralGround ? 'hidden' : 'flex'
            } flex-row justify-between mb-[-20px] `}
          >
            <p className="text-sm">Home</p>
            <p className="text-sm">Away</p>
          </div>

          {individualTeamPagesEnabled ? (
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
                <Heading1>{result.homeTeamDetails.name}</Heading1>
              </LinkButton>
              <Heading1>
                {homeGoals} - {awayGoals}
              </Heading1>
              <LinkButton
                color="var(--text)"
                bgHoverColor="transparent"
                borderlessButton={true}
                underlineEffect={true}
                shadowEffect={false}
                href={'/'}
                style={{ padding: 0, width: 'max-content' }}
              >
                <Heading1>{result.awayTeamDetails.name}</Heading1>
              </LinkButton>
            </div>
          ) : (
            <div className="flex flex-row justify-between gap-[20px]">
              <Heading1>{result.homeTeamDetails.name}</Heading1>

              <Heading1>
                {homeGoals} - {awayGoals}
              </Heading1>

              <Heading1>{result.awayTeamDetails.name}</Heading1>
            </div>
          )}
        </div>
      </LeagueBanner>
      <div
        className="flex flex-col gap-5 mx-5"
        style={{ marginRight: `${mr}px` }}
      >
        <DetailsRibbon league={league} result={result} />
        <div className="w-full grid grid-cols-3 grid-rows-[repeat(3,min-content)] gap-5">
          {/* <AiSummary league={league} result={result} /> */}

          <AsItStood league={league} result={result} />
          <MatchOutcome result={result} />
          <HeadToHead
            teams={{
              home: result.homeTeamDetails.name,
              away: result.awayTeamDetails.name,
            }}
            league={league}
            userOwnsThisLeague={userOwnsThisLeague}
          />
        </div>
      </div>
    </div>
  );
}

function DetailsRibbon({ league, result }: { league: League; result: Result }) {
  return (
    <div className="grid grid-rows-1 grid-cols-3 place-self-center place-items-center text-base">
      <p className="justify-self-end">
        Season {league.currentSeason} Matchweek {league.currentMatchweek}
      </p>

      <Button as={Link} href={`/leagues/${league._id}`} variant="flat">
        {league.name}
      </Button>
      <p className="text-base justify-self-start">
        {/* FIXME: Result object returned from API should include table name too */}
        {/* {league.tables[result.division - 1].name} (div {result.division}) */}
        FIX ME
      </p>
      {result.neutralGround && <p className="text-base">Neutral Ground</p>}
    </div>
  );
}
