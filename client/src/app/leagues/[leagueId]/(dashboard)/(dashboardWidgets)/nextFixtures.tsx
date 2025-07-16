'use client';
import EditSVG from '@/assets/svg components/Edit';
import Button from '@/components/text/Button';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { Fixture, League } from '@/util/definitions';
import { useParams, useRouter } from 'next/navigation';
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';

export default function NextFixtures({
  league,
  seasonViewing = league.currentSeason,
  userOwnsThisLeague,
  setShowFixtureToResult,
}: {
  league: League;
  seasonViewing?: number;
  userOwnsThisLeague: boolean;

  setShowFixtureToResult: Dispatch<SetStateAction<Fixture | null>>;
}) {
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/fixtures?limit=3&season=${seasonViewing}`,
        {
          method: 'GET',
        }
      ),
    queryKey: ['fixtures', seasonViewing],
  });

  const fixtures:
    | {
        totalFixtures: number;
        fixturesReturned: number;
        fixtures: Fixture[];
      }
    | undefined = data?.data;

  const nextFixtures: Fixture[] | undefined = data?.data.fixtures.slice(0, 3);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const [isHoveringOuterPanel, setIsHoveringOuterPanel] = useState(false);
  const router = useRouter();

  return (
    <motion.div
      className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 flex flex-col gap-1 hover:cursor-pointer
    "
      onMouseEnter={() => setIsHoveringOuterPanel(true)}
      onMouseLeave={() => setIsHoveringOuterPanel(false)}
      whileTap={{ scale: isHoveringOuterPanel ? 0.98 : 1 }}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/leagues/${league._id}/fixtures`);
      }}
      style={{
        background: isHoveringOuterPanel ? 'var(--bg-light)' : 'var(--bg)',
        borderColor: isHoveringOuterPanel ? 'transparent' : 'var(--border)',
      }}
    >
      <div className="flex flex-row items-baseline gap-[4px]">
        <Paragraph
          style={{
            color: 'var(--text)',
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          Fixtures{' '}
        </Paragraph>
        {fixtures !== undefined &&
          nextFixtures !== undefined &&
          nextFixtures.length >= 3 &&
          !isLoading && (
            <Label
              style={{
                color: 'var(--text-muted)',
                fontWeight: 'normal',
                display: 'inline',
              }}
            >
              - showing {nextFixtures.length} of {fixtures.totalFixtures}
            </Label>
          )}
      </div>
      {isLoading || nextFixtures === undefined || fixtures === undefined ? (
        <>
          <FixtureRowSkeleton />
          <FixtureRowSkeleton />
          <FixtureRowSkeleton />
        </>
      ) : nextFixtures.length > 0 ? (
        nextFixtures.map((f, i) => (
          <div
            key={i}
            onMouseEnter={() => setIsHoveringOuterPanel(false)}
            onMouseLeave={() => setIsHoveringOuterPanel(true)}
          >
            <FixtureRow
              userOwnsThisLeague={userOwnsThisLeague}
              fixtureObj={f}
              setShowFixtureToResult={setShowFixtureToResult}
            />
          </div>
        ))
      ) : (
        <Label
          style={{
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            fontWeight: 'normal',
            placeSelf: 'center',
          }}
        >
          No outstanding fixtures
        </Label>
      )}
    </motion.div>
  );
}

function FixtureRow({
  userOwnsThisLeague,
  fixtureObj,
  setShowFixtureToResult,
}: {
  userOwnsThisLeague: boolean;
  fixtureObj: Fixture;
  setShowFixtureToResult: Dispatch<SetStateAction<Fixture | null>>;
}) {
  const router = useRouter();
  const { leagueId } = useParams();

  function handleFixtureClick(e: MouseEvent) {
    e.stopPropagation();
    router.push(`/leagues/${leagueId}/fixture/${fixtureObj._id}`);
  }

  return (
    <motion.div
      className="bg-[var(--bg)] hover:bg-[var(--bg-light)] rounded-[10px] h-[36px] border-1 border-[var(--border)] hover:border-transparent hover:cursor-pointer flex flex-row justify-baseline items-center"
      onClick={(e) => handleFixtureClick(e)}
      whileTap={{ scale: 0.98 }}
    >
      <Label
        style={{
          fontWeight: 'normal',
          color: 'var(--text-muted)',
          padding: '0 10px',
          width: 'max-content',
          height: 'min-content',
          flex: 'none',
        }}
      >
        MD {fixtureObj.matchweek}
      </Label>
      <div className="grid grid-rows-1 grid-cols-[1fr_40px_1fr] flex-grow place-items-end">
        <Paragraph
          style={{
            width: '100%',
            textAlign: 'right',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {fixtureObj.homeTeamDetails.name}
        </Paragraph>
        <Label
          style={{
            width: '100%',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontWeight: 'normal',
          }}
        >
          vs
        </Label>
        <Paragraph
          style={{
            width: '100%',
            textAlign: 'left',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {fixtureObj.awayTeamDetails.name}
        </Paragraph>
      </div>
      {userOwnsThisLeague && (
        <Button
          color="transparent"
          bgHoverColor="var(--bg-dark)"
          borderlessButton={true}
          underlineEffect={false}
          shadowEffect={false}
          style={{ padding: '10px' }}
          onClick={(e) => {
            e.stopPropagation();
            setShowFixtureToResult(fixtureObj);
          }}
        >
          <EditSVG className="w-[16px] h-[16px] fill-[var(--text)]" />
        </Button>
      )}
    </motion.div>
  );
}
function FixtureRowSkeleton() {
  return (
    <div className="bg-[var(--bg-light)] rounded-[10px] h-[36px] border-1 border-[var(--border)] flex flex-row justify-baseline items-center animate-pulse "></div>
  );
}
