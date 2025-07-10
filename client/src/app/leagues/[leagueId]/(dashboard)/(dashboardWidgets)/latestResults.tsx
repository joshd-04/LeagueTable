import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { Result } from '@/util/definitions';

export default function LatestResults({ results }: { results: Result[] }) {
  const mostRecentResults = results.slice(0, 3);
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
          Latest Results
        </Paragraph>
      </span>
      {mostRecentResults.length > 0 ? (
        mostRecentResults.map((result, i) => (
          <ResultRow key={i} result={result} />
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
          No results yet
        </Label>
      )}
    </div>
  );
}

function ResultRow({ result }: { result: Result }) {
  const homeGoals = result.basicOutcome.reduce(
    (acc, cur) => (cur === 'home' ? acc + 1 : acc),
    0
  );
  const awayGoals = result.basicOutcome.reduce(
    (acc, cur) => (cur === 'away' ? acc + 1 : acc),
    0
  );
  return (
    <div className="bg-[var(--bg)] hover:bg-[var(--bg-light)] rounded-[10px] border-1 border-[var(--border)] hover:border-transparent hover:cursor-pointer flex flex-row justify-baseline items-center">
      <Label
        style={{
          fontWeight: 'normal',
          color: 'var(--text-muted)',
          padding: '0 10px',
        }}
      >
        MD {result.matchweek}
      </Label>
      <div className="grid grid-rows-1 grid-cols-[1fr_80px_1fr] flex-grow">
        <Paragraph
          style={{
            width: '100%',
            textAlign: 'right',
          }}
        >
          {result.homeTeamDetails.name}
        </Paragraph>
        <Paragraph style={{ width: '100%', textAlign: 'center' }}>
          {homeGoals} <span className="text-[var(--text-muted)]">-</span>{' '}
          {awayGoals}
        </Paragraph>
        <Paragraph
          style={{
            width: '100%',
            textAlign: 'left',
          }}
        >
          {result.awayTeamDetails.name}
        </Paragraph>
      </div>
      {/* {userOwnsThisLeague && (
        <Button
          color="transparent"
          bgHoverColor="var(--bg-dark)"
          borderlessButton={true}
          underlineEffect={false}
          shadowEffect={false}
        >
          <EditSVG className="w-[16px] h-[16px] fill-[var(--text)]" />
        </Button>
      )} */}
    </div>
  );
}
