'use client';
import { Fixture, League } from '@/util/definitions';
import Heading1 from '@/components/text/Heading1';

import LinkButton from '@/components/text/LinkButton';

import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import MatchPreview from './(widgets)/matchPreview';
import HeadToHead from './(widgets)/headToHead';
import useAccount from '@/hooks/useAccount';

export default function FixtureFuture({
  league,
  fixture,
}: {
  league: League;
  fixture: Fixture;
}) {
  const { user, isLoggedIn } = useAccount();

  let userOwnsThisLeague = false;
  if (isLoggedIn && user !== undefined && user !== null) {
    if (user.id === league.leagueOwner._id) {
      userOwnsThisLeague = true;
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
              style={{ padding: 0 }}
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
              style={{ padding: 0 }}
            >
              <Heading1>{fixture.awayTeamDetails.name}</Heading1>
            </LinkButton>
          </div>
        </div>
      </LeagueBanner>
      <div className="flex flex-col gap-[20px] mx-[20px]">
        <div className="flex flex-row justify-center items-center gap-[50px]">
          <p className="text-base">
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
          <p className="text-base">Division {fixture.division}</p>
          {fixture.neutralGround && <p className="text-base">Neutral Ground</p>}
        </div>
        <div className="w-full grid grid-cols-3 grid-rows-[repeat(3,min-content)] gap-[20px]">
          <div className="p-[20px]  h-full w-full  bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
            <p className="text-base">AI insights</p>
            <p className="text-sm">
              AI Insights not available yet. Come back when matchweek{' '}
              {fixture.matchweek} starts!
            </p>
          </div>
          <MatchPreview fixture={fixture} />
          <HeadToHead
            fixture={fixture}
            league={league}
            userOwnsThisLeague={userOwnsThisLeague}
          />
        </div>
      </div>
    </div>
  );
}
