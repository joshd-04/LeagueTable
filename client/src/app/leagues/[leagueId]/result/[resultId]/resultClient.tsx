'use client';
import Paragraph from '@/components/text/Paragraph';
import { GlobalContext } from '@/context/GlobalContextProvider';
import useAccount from '@/hooks/useAccount';
import { League, Result } from '@/util/definitions';
import { useContext } from 'react';
import Heading1 from '@/components/text/Heading1';
import Label from '@/components/text/Label';
import LinkButton from '@/components/text/LinkButton';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import MatchOutcome from './(resultWidgets)/matchOutcome';
import AsItStood from './(resultWidgets)/asItStood';

export default function ResultClient({
  league,
  result,
}: {
  league: League;
  result: Result;
}) {
  const context = useContext(GlobalContext);
  const { user } = context.account;
  const { isLoggedIn } = useAccount();

  const homeGoals = result.basicOutcome.reduce(
    (acc, team) => (team === 'home' ? acc + 1 : acc),
    0
  );
  const awayGoals = result.basicOutcome.reduce(
    (acc, team) => (team === 'away' ? acc + 1 : acc),
    0
  );

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
              result.neutralGround ? 'hidden' : 'flex'
            } flex-row justify-between mb-[-20px] `}
          >
            <Label style={{ fontWeight: 'normal' }}>Home</Label>
            <Label style={{ fontWeight: 'normal' }}>Away</Label>
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
              style={{ padding: 0 }}
            >
              <Heading1>{result.awayTeamDetails.name}</Heading1>
            </LinkButton>
          </div>
        </div>
      </LeagueBanner>
      <div className="flex flex-col gap-[20px] mx-[20px]">
        <div className="flex flex-row justify-center items-center gap-[50px]">
          <Paragraph>
            Season {result.season} Matchweek {result.matchweek}
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
          <Paragraph>Division {result.division}</Paragraph>
          {result.neutralGround && <Paragraph>Neutral Ground</Paragraph>}
        </div>
        <div className="w-full grid grid-cols-3 grid-rows-[repeat(3,min-content)] gap-[20px]">
          <div className="p-[20px]  h-full w-full  bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
            <Paragraph style={{ color: 'var(--info)' }}>AI insights</Paragraph>
          </div>
          <MatchOutcome result={result} />
          <AsItStood result={result} />
        </div>
      </div>
    </div>
  );
}
