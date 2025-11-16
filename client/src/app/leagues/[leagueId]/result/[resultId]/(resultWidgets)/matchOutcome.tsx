import { Result } from '@/util/definitions';

export default function MatchOutcome({ result }: { result: Result }) {
  function calculateScore(index: number) {
    let homeGoals = 0;
    let awayGoals = 0;
    result.basicOutcome.forEach((goal, i) => {
      if (i > index) return;
      if (goal === 'home') homeGoals += 1;
      if (goal === 'away') awayGoals += 1;
    });
    return `${homeGoals}-${awayGoals}`;
  }
  return (
    <div className="p-[20px] h-full w-full  bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <p className="text-md">Match outcome</p>
      <div
        className="max-h-[24rem] overflow-y-auto flex flex-col items-center  gap-2 "
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--border) transparent',
        }}
      >
        <p className="text-sm">Match start. 0-0</p>
        {result.detailedOutcome !== undefined &&
        result.detailedOutcome.length !== 0
          ? result.detailedOutcome.map((goal, i) => {
              const score = calculateScore(i);
              return (
                <MatchOutcomeRowAdvanced
                  goal={goal}
                  homeTeamDetails={result.homeTeamDetails}
                  awayTeamDetails={result.awayTeamDetails}
                  score={score}
                  key={i}
                />
              );
            })
          : result.basicOutcome.map((goal, i) => {
              const score = calculateScore(i);
              return (
                <MatchOutcomeRowBasic
                  goal={goal}
                  homeTeamDetails={result.homeTeamDetails}
                  awayTeamDetails={result.awayTeamDetails}
                  score={score}
                  key={i}
                />
              );
            })}
        <p className="text-sm">
          Full time: {calculateScore(result.basicOutcome.length - 1)}
        </p>
      </div>
    </div>
  );
}

function MatchOutcomeRowBasic({
  goal,
  homeTeamDetails,
  awayTeamDetails,
  score,
}: {
  goal: 'home' | 'away';

  homeTeamDetails: {
    division: number;
    form: string;
    leaguePosition: number;
    matchesPlayed: number;
    name: string;
    points: number;
    teamId: string;
  };
  awayTeamDetails: {
    division: number;
    form: string;
    leaguePosition: number;
    matchesPlayed: number;
    name: string;
    points: number;
    teamId: string;
  };
  score: string;
}) {
  const [homeGoals, awayGoals] = score.split('-');
  return (
    <div className="grid grid-cols-[1fr_max-content_1fr] bg-[var(--bg-light)] px-4 py-2 rounded-[10px] w-full">
      {goal === 'home' ? (
        <div className="flex flex-col justify-center ">
          <p className="text-sm">Goal: {homeTeamDetails.name}</p>
        </div>
      ) : (
        <div></div>
      )}
      <div className="place-self-center text-md">
        {goal === 'home' ? (
          <p className=" text-muted">
            <span className="text-[var(--text)] font-bold">{homeGoals}</span>-
            {awayGoals}
          </p>
        ) : (
          <p className=" text-muted">
            {homeGoals}-
            <span className="text-[var(--text)] font-bold">{awayGoals}</span>
          </p>
        )}
      </div>
      {goal === 'away' ? (
        <div className="flex flex-col justify-center items-end">
          <p className="text-sm">Goal: {awayTeamDetails.name}</p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

function MatchOutcomeRowAdvanced({
  goal,
  homeTeamDetails,
  awayTeamDetails,
  score,
}: {
  goal: {
    scorer: string;
    assist: string | undefined;
    team: 'home' | 'away';
    isOwnGoal: boolean;
    _id: string;
  };
  homeTeamDetails: {
    division: number;
    form: string;
    leaguePosition: number;
    matchesPlayed: number;
    name: string;
    points: number;
    teamId: string;
  };
  awayTeamDetails: {
    division: number;
    form: string;
    leaguePosition: number;
    matchesPlayed: number;
    name: string;
    points: number;
    teamId: string;
  };
  score: string;
}) {
  const [homeGoals, awayGoals] = score.split('-');
  return (
    <div className="grid grid-cols-[1fr_max-content_1fr] bg-[var(--bg-light)] px-4 py-2 rounded-[10px] w-full">
      {goal.team === 'home' ? (
        <div className="place-self-start  flex flex-col items-start ">
          <p className="text-sm">Goal: {homeTeamDetails.name}</p>
          <p className="text-sm">⚽ {goal.scorer}</p>
          {goal.assist && <p className="text-sm">👟 {goal.assist}</p>}
        </div>
      ) : (
        <div></div>
      )}
      <div className="place-self-center text-md">
        {goal.team === 'home' ? (
          <p className=" text-muted">
            <span className="text-[var(--text)] font-bold">{homeGoals}</span>-
            {awayGoals}
          </p>
        ) : (
          <p className=" text-muted">
            {homeGoals}-
            <span className="text-[var(--text)] font-bold">{awayGoals}</span>
          </p>
        )}
      </div>
      {goal.team === 'away' ? (
        <div className="place-self-end flex flex-col items-end">
          <p className="text-sm">Goal: {awayTeamDetails.name}</p>
          <p className="text-sm">⚽ {goal.scorer}</p>
          {goal.assist && <p className="text-sm">👟 {goal.assist}</p>}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
