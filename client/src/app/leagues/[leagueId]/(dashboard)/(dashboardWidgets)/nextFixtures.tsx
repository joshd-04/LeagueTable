import EditSVG from '@/assets/svg components/Edit';
import Button from '@/components/text/Button';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { Fixture } from '@/util/definitions';
import { useParams, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

export default function NextFixtures({
  userOwnsThisLeague,
  fixtures,
  setShowFixtureToResult,
}: {
  userOwnsThisLeague: boolean;
  fixtures: Fixture[];
  setShowFixtureToResult: Dispatch<SetStateAction<Fixture | null>>;
}) {
  const nextFixtures = fixtures.slice(0, 3);
  return (
    <div className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-1">
      <span>
        <Paragraph
          style={{
            color: 'var(--text)',
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          Fixtures
        </Paragraph>
      </span>
      {nextFixtures.length > 0 ? (
        nextFixtures.map((f, i) => (
          <FixtureRow
            userOwnsThisLeague={userOwnsThisLeague}
            fixtureObj={f}
            setShowFixtureToResult={setShowFixtureToResult}
            key={i}
          />
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
    </div>
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
  function handleFixtureClick() {
    router.push(`/leagues/${leagueId}/fixture/${fixtureObj._id}`);
  }
  return (
    <span
      className="bg-[var(--bg)] hover:bg-[var(--bg-light)] rounded-[10px] border-1 border-[var(--border)] hover:border-transparent hover:cursor-pointer flex flex-row justify-baseline items-center"
      onClick={handleFixtureClick}
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
    </span>
  );
}
