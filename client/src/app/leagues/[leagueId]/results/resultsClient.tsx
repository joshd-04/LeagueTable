'use client';
import Paragraph from '@/components/text/Paragraph';
import { Result, League } from '@/util/definitions';
import Heading1 from '@/components/text/Heading1';
import Label from '@/components/text/Label';
import LinkButton from '@/components/text/LinkButton';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import Subtitle from '@/components/text/Subtitle';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResultsClient({
  league,
  results,
}: {
  league: League;
  results: Result[];
}) {
  const router = useRouter();
  const [sort, setSort] = useState<'matchweek' | 'most recent'>('matchweek');

  function handleClick(id: string) {
    router.push(`/leagues/${league._id}/result/${id}`);
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <LeagueBanner league={league}>
        <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
          <Heading1>Results</Heading1>
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
          <Paragraph>
            <select
              className="bg-[var(--bg)] p-2 rounded-[10px] outline-none"
              value={sort}
              onChange={(e) => {
                if (
                  !['matchweek', 'most recent'].some(
                    (x) => e.target.value === x
                  )
                ) {
                  return;
                }

                setSort(e.target.value as 'matchweek' | 'most recent');
              }}
            >
              <option value="matchweek">Matchweek</option>
              <option value="most recent">Most recent</option>
            </select>
          </Paragraph>
        </div>
      </div>
      <div className="w-[50%] place-self-center">
        {sort === 'matchweek' ? (
          <ResultsByMatchweek
            results={results}
            league={league}
            handleClick={handleClick}
          />
        ) : (
          <ResultsByMostRecent
            results={results}
            league={league}
            handleClick={handleClick}
          />
        )}
      </div>
    </div>
  );
}

function ResultRow({
  result,
  handleClick,
}: {
  result: Result;
  handleClick: (id: string) => void;
}) {
  const homeGoals = result.basicOutcome.reduce(
    (acc, goal) => (goal === 'home' ? acc + 1 : acc),
    0
  );
  const awayGoals = result.basicOutcome.reduce(
    (acc, goal) => (goal === 'away' ? acc + 1 : acc),
    0
  );
  return (
    <motion.div
      className="bg-[var(--bg)] w-full border-1 border-[var(--border)] rounded-[10px] p-[10px] grid grid-rows-1 grid-cols-[1fr_auto_1fr] gap-[6px] items-center hover:bg-[var(--bg-light)] hover:cursor-pointer hover:border-transparent"
      whileTap={{ scale: 0.98 }}
      onClick={() => handleClick(result._id)}
    >
      <div className="grid grid-rows-1 grid-cols-[1fr_3ch] gap-[20px] items-baseline justify-items-end">
        <Subtitle>{result.homeTeamDetails.name}</Subtitle>
        <Subtitle>{homeGoals}</Subtitle>
      </div>
      <Label
        style={{
          fontWeight: 'bold',
          textAlign: 'center',
          alignItems: 'baseline',
          verticalAlign: 'middle',
        }}
      >
        -
      </Label>

      <div className="grid grid-rows-1 grid-cols-[3ch_1fr] gap-[20px] items-baseline">
        <Subtitle>{awayGoals}</Subtitle>
        <Subtitle>{result.awayTeamDetails.name}</Subtitle>
      </div>
    </motion.div>
  );
}

function ResultsByMostRecent({
  league,
  results,
  handleClick,
}: {
  league: League;
  results: Result[];
  handleClick: (id: string) => void;
}) {
  const organisedResults: { matchweek: number; results: Result[] }[] = [];

  results.forEach((result) => {
    if (organisedResults.length === 0) {
      organisedResults.push({ matchweek: result.matchweek, results: [result] });
    } else if (organisedResults.slice(-1)[0].matchweek === result.matchweek) {
      organisedResults.slice(-1)[0].results.push(result);
    } else {
      organisedResults.push({ matchweek: result.matchweek, results: [result] });
    }
  });
  return (
    <div className="flex flex-col gap-[20px]">
      {organisedResults.map((data, i) => (
        <div key={i}>
          <Label
            style={{
              fontWeight: 'bold',
              marginBottom: '10px',
              placeSelf: 'center',
            }}
          >
            Matchweek {data.matchweek}{' '}
            {+data.matchweek > league.currentMatchweek && '(future)'}
          </Label>
          <div className="flex flex-col gap-[10px]">
            {data.results.map((result, i) => (
              <ResultRow result={result} key={i} handleClick={handleClick} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
function ResultsByMatchweek({
  league,
  results,
  handleClick,
}: {
  league: League;
  results: Result[];
  handleClick: (id: string) => void;
}) {
  // Go through all the results and put them into a dictionary based off matchweek
  const organisedResults: { [key: number]: Result[] } = {};

  results.forEach((result) => {
    if (!Object.keys(organisedResults).includes(result.matchweek.toString())) {
      // if matchweek not in results list already
      organisedResults[result.matchweek] = [result];
    } else {
      // push the result to the matchweek
      organisedResults[result.matchweek].push(result);
    }
  });

  return (
    <div className="flex flex-col gap-[20px]">
      {Object.entries(organisedResults)
        .sort(([mwA], [mwB]) => {
          return +mwB - +mwA; // sorts it from highest mw to lowest
        })
        .map(([matchweek, results], i) => (
          <div key={i}>
            <Label
              style={{fontWeight:'bold',
                marginBottom: '10px',
                placeSelf: 'center',
              }}
            >
              Matchweek {matchweek}{' '}
              {+matchweek > league.currentMatchweek && '(future)'}
            </Label>

            <div className="flex flex-col gap-[10px]">
              {results.map((result, i) => (
                <ResultRow result={result} key={i} handleClick={handleClick} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
