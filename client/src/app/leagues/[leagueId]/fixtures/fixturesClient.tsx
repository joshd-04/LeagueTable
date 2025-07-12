'use client';
import Paragraph from '@/components/text/Paragraph';
import { GlobalContext } from '@/context/GlobalContextProvider';
import useAccount from '@/hooks/useAccount';
import { Fixture, League } from '@/util/definitions';
import { useContext } from 'react';
import Heading1 from '@/components/text/Heading1';
import Label from '@/components/text/Label';
import LinkButton from '@/components/text/LinkButton';
import TeamForm from '@/components/teamForm/TeamForm';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import Subtitle from '@/components/text/Subtitle';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function FixturesClient({
  league,
  fixtures,
}: {
  league: League;
  fixtures: Fixture[];
}) {
  const context = useContext(GlobalContext);
  const { user } = context.account;
  const { isLoggedIn } = useAccount();

  const router = useRouter();

  let userOwnsThisLeague = false;
  if (isLoggedIn && user !== undefined && user !== null) {
    if (user.id === league.leagueOwner._id) {
      userOwnsThisLeague = true;
    }
  }

  function handleClick(id: string) {
    router.push(`/leagues/${league._id}/fixture/${id}`);
  }

  // Go through all the fixtures and put them into a dictionary based off matchweek
  const organisedFixtures: { [key: number]: Fixture[] } = {};

  fixtures.forEach((fixture) => {
    if (
      !Object.keys(organisedFixtures).includes(fixture.matchweek.toString())
    ) {
      // if matchweek not in fixtures list already
      organisedFixtures[fixture.matchweek] = [fixture];
    } else {
      // push the fixture to the matchweek
      organisedFixtures[fixture.matchweek].push(fixture);
    }
  });

  return (
    <div className="flex flex-col gap-[20px]">
      <LeagueBanner league={league}>
        <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
          <Heading1>Fixtures</Heading1>
        </div>
      </LeagueBanner>
      <div className="flex flex-col gap-[20px] mx-[20px]">
        <div className="flex flex-row justify-center items-center gap-[50px]">
          <Paragraph>
            Season {league.currentSeason} Matchweek {league.currentMatchweek}
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
        </div>
      </div>
      <div className="w-[50%] place-self-center">
        <div className="flex flex-col gap-[20px]">
          {Object.entries(organisedFixtures).map(([matchweek, fixtures], i) => (
            <div key={i}>
              <Label
                style={{
                  color: 'var(--text-muted)',
                  marginBottom: '10px',
                  placeSelf: 'center',
                }}
              >
                Matchweek {matchweek}{' '}
                {+matchweek > league.currentMatchweek && '(future)'}
              </Label>

              <div className="flex flex-col gap-[10px]">
                {fixtures.map((fixture, i) =>
                  +matchweek > league.currentMatchweek ? (
                    <FixtureRowFuture fixture={fixture} key={i} />
                  ) : (
                    <FixtureRow
                      fixture={fixture}
                      key={i}
                      handleClick={handleClick}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FixtureRow({
  fixture,
  handleClick,
}: {
  fixture: Fixture;
  handleClick: (id: string) => void;
}) {
  return (
    <motion.div
      className="bg-[var(--bg)] w-full border-1 border-[var(--border)] rounded-[10px] p-[10px] grid grid-rows-1 grid-cols-[1fr_auto_1fr] gap-[20px] items-baseline hover:bg-[var(--bg-light)] hover:cursor-pointer hover:border-transparent"
      whileTap={{ scale: 0.98 }}
      onClick={() => handleClick(fixture._id)}
    >
      <div className="grid grid-rows-1 grid-cols-[1fr_6ch_160px] gap-[20px] items-baseline justify-items-end">
        <TeamForm form={fixture.homeTeamDetails.form} />
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {fixture.homeTeamDetails.wins * 3 + fixture.homeTeamDetails.draws} pts
        </Paragraph>
        <Subtitle>{fixture.homeTeamDetails.name}</Subtitle>
      </div>
      <Label style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
        vs
      </Label>

      <div className="grid grid-rows-1 grid-cols-[160px_6ch_1fr] gap-[20px] items-baseline">
        <Subtitle>{fixture.awayTeamDetails.name}</Subtitle>
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {fixture.awayTeamDetails.wins * 3 + fixture.awayTeamDetails.draws} pts
        </Paragraph>
        <TeamForm form={fixture.awayTeamDetails.form} />
      </div>
    </motion.div>
  );
}

function FixtureRowFuture({ fixture }: { fixture: Fixture }) {
  return (
    <div className="bg-[var(--bg)] w-full border-1 border-[var(--border)] rounded-[10px] p-[10px] grid grid-rows-1 grid-cols-[1fr_auto_1fr] gap-[20px] items-baseline brightness-80">
      <div className="grid grid-rows-1 grid-cols-[1fr_6ch_160px] gap-[20px] items-baseline justify-items-end">
        <TeamForm form={fixture.homeTeamDetails.form} />
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {fixture.homeTeamDetails.wins * 3 + fixture.homeTeamDetails.draws} pts
        </Paragraph>
        <Subtitle style={{ color: 'var(--text-muted)' }}>
          {fixture.homeTeamDetails.name}
        </Subtitle>
      </div>
      <Label style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
        vs
      </Label>

      <div className="grid grid-rows-1 grid-cols-[160px_6ch_1fr] gap-[20px] items-baseline">
        <Subtitle style={{ color: 'var(--text-muted)' }}>
          {fixture.awayTeamDetails.name}
        </Subtitle>
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {fixture.awayTeamDetails.wins * 3 + fixture.awayTeamDetails.draws} pts
        </Paragraph>
        <TeamForm form={fixture.awayTeamDetails.form} />
      </div>
    </div>
  );
}
