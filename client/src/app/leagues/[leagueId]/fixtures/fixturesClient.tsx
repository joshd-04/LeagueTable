'use client';
import Paragraph from '@/components/text/Paragraph';
import { Fixture, League } from '@/util/definitions';
import Heading1 from '@/components/text/Heading1';
import Label from '@/components/text/Label';
import LinkButton from '@/components/text/LinkButton';
import TeamForm from '@/components/teamForm/TeamForm';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import Subtitle from '@/components/text/Subtitle';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import Pagination from '@/components/pagination/Pagination';

export default function FixturesClient({
  league,
  fixtures,
}: {
  league: League;
  fixtures: Fixture[];
}) {
  const router = useRouter();
  // 0 means all divsions, other numbers mean that specific division only
  const [divisionFilter, setDivisionFilter] = useState(0);
  // const [filteredFixtures, setFilteredFixtures]

  const [matchweekViewing, setMatchweekViewing] = useState(
    league.currentMatchweek
  );

  function handleClick(id: string) {
    router.push(`/leagues/${league._id}/fixture/${id}`);
  }

  const [displayedFixtures, setDisplayedFixtures] = useState(fixtures);

  let filteredFixtures: Fixture[] = [];

  if (divisionFilter === 0) {
    filteredFixtures = displayedFixtures;
  } else {
    filteredFixtures = displayedFixtures.filter(
      (fixture) => fixture.division === divisionFilter
    );
  }

  const { refetch: refetchFixtures } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/fixtures?matchweek=${matchweekViewing}`,
        {
          method: 'GET',
        }
      ),
    queryKey: ['fixtures'],

    enabled: false,
  });

  useEffect(() => {
    if (matchweekViewing < 1 || matchweekViewing > league.finalMatchweek)
      return;
    const fetchData = async () => {
      const { data } = await refetchFixtures();
      if (data.status === 'success') {
        setDisplayedFixtures(data.data.fixtures);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchweekViewing]);

  return (
    <div className="flex flex-col gap-[20px]">
      <LeagueBanner league={league}>
        <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
          <Heading1>Fixtures</Heading1>
        </div>
      </LeagueBanner>
      <div className="flex flex-col gap-[20px] mx-[20px]">
        <div className="grid  grid-rows-1 grid-cols-[1fr_auto_1fr] place-items-center gap-12">
          <Paragraph style={{ justifySelf: 'end' }}>
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
          <Paragraph style={{ justifySelf: 'start' }}>
            <select
              className="bg-[var(--bg)] hover:bg-[var(--bg-light)] p-2 rounded-[10px] outline-none cursor-pointer"
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(+e.target.value)}
            >
              <option value={0}>All fixtures</option>
              {league.tables
                .filter((table) => table.season === league.currentSeason)
                .map((table, i) => (
                  <option value={table.division} key={i}>
                    {table.name}
                  </option>
                ))}
            </select>
          </Paragraph>
        </div>
      </div>
      <div className="w-[50%] place-self-center">
        <div className="flex flex-col gap-[20px]">
          <div>
            <Label
              style={{
                fontWeight: 'bold',
                marginBottom: '10px',
                placeSelf: 'center',
              }}
            >
              Matchweek {matchweekViewing}{' '}
              {+matchweekViewing > league.currentMatchweek && '(future)'}
            </Label>

            <div className="flex flex-col gap-[10px]">
              {filteredFixtures.map((fixture, i) =>
                +matchweekViewing > league.currentMatchweek ? (
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
        </div>

        <Pagination
          page={matchweekViewing}
          setPage={setMatchweekViewing}
          lastPage={league.finalMatchweek}
        />
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
  const homePoints =
    fixture.homeTeamDetails.wins * 3 + fixture.homeTeamDetails.draws;
  const awayPoints =
    fixture.awayTeamDetails.wins * 3 + fixture.awayTeamDetails.draws;
  return (
    <motion.div
      className="bg-[var(--bg)] w-full border-1 border-[var(--border)] rounded-[10px] p-[10px] grid grid-rows-1 grid-cols-[1fr_auto_1fr] gap-[20px] items-baseline hover:bg-[var(--bg-light)] hover:cursor-pointer hover:border-transparent"
      whileTap={{ scale: 0.98 }}
      onClick={() => handleClick(fixture._id)}
    >
      <div className="grid grid-rows-1 grid-cols-[1fr_6ch_160px] gap-[20px] items-baseline justify-items-end">
        <TeamForm form={fixture.homeTeamDetails.form} />
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {homePoints} pt{homePoints === 1 ? '' : 's'}
        </Paragraph>
        <Subtitle
          style={{
            textAlign: 'right',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          {fixture.homeTeamDetails.name}
        </Subtitle>
      </div>
      <Label style={{ fontWeight: 'bold', textAlign: 'center' }}>vs</Label>

      <div className="grid grid-rows-1 grid-cols-[160px_6ch_1fr] gap-[20px] items-baseline">
        <Subtitle
          style={{
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {fixture.awayTeamDetails.name}
        </Subtitle>
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {awayPoints} pt{awayPoints === 1 ? '' : 's'}
        </Paragraph>
        <TeamForm form={fixture.awayTeamDetails.form} />
      </div>
    </motion.div>
  );
}

function FixtureRowFuture({ fixture }: { fixture: Fixture }) {
  const homePoints =
    fixture.homeTeamDetails.wins * 3 + fixture.homeTeamDetails.draws;
  const awayPoints =
    fixture.awayTeamDetails.wins * 3 + fixture.awayTeamDetails.draws;
  return (
    <div className="bg-[var(--bg)] w-full border-1 border-[var(--border)] rounded-[10px] p-[10px] grid grid-rows-1 grid-cols-[1fr_auto_1fr] gap-[20px] items-baseline brightness-80">
      <div className="grid grid-rows-1 grid-cols-[1fr_6ch_160px] gap-[20px] items-baseline justify-items-end">
        <TeamForm form={fixture.homeTeamDetails.form} />
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {homePoints} pt{homePoints === 1 ? '' : 's'}
        </Paragraph>
        <Subtitle
          style={{
            color: 'var(--text-muted)',
            textAlign: 'right',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          {fixture.homeTeamDetails.name}
        </Subtitle>
      </div>
      <Label style={{ fontWeight: 'bold', textAlign: 'center' }}>vs</Label>

      <div className="grid grid-rows-1 grid-cols-[160px_6ch_1fr] gap-[20px] items-baseline">
        <Subtitle
          style={{
            color: 'var(--text-muted)',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {fixture.awayTeamDetails.name}
        </Subtitle>
        <Paragraph style={{ display: 'inline', color: 'var(--text-muted)' }}>
          {awayPoints} pt{awayPoints === 1 ? '' : 's'}
        </Paragraph>
        <TeamForm form={fixture.awayTeamDetails.form} />
      </div>
    </div>
  );
}
