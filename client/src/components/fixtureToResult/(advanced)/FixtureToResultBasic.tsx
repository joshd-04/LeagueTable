import { Dispatch, SetStateAction, useState } from 'react';
import Paragraph from '../../text/Paragraph';
import { AnimatePresence, motion } from 'motion/react';
import Button from '../../text/Button';
import Subtitle from '../../text/Subtitle';
import { Fixture } from '@/util/definitions';
import Label from '../../text/Label';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';

export default function FixtureToResultBasic({
  fixtureObj,
  setShowFixtureToResult,
  fetchLatestData,
}: {
  fixtureObj: Fixture;
  setShowFixtureToResult: Dispatch<SetStateAction<Fixture | null>>;
  fetchLatestData: () => Promise<void>;
}) {
  const [matchStory, setMatchStory] = useState<('home' | 'away')[]>([]);

  function calculateScore(index: number) {
    let homeGoals = 0;
    let awayGoals = 0;
    matchStory.forEach((goal, i) => {
      if (i > index) return;
      if (goal === 'home') homeGoals += 1;
      if (goal === 'away') awayGoals += 1;
    });
    return `${homeGoals}-${awayGoals}`;
  }

  async function handleSubmit() {
    const basicOutcome = matchStory;
    const x = {
      fixtureId: fixtureObj._id,
      basicOutcome: basicOutcome,
    };
    await fetchAPI(`${API_URL}/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(x),
      credentials: 'include',
    });
    setShowFixtureToResult(null);
    await fetchLatestData();
  }

  return (
    <div>
      <AnimatePresence>
        <motion.div
          key="dropping-box"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`w-[440px] bg-[var(--bg)] fixed left-[50%] top-[50%] translate-[-50%] rounded-[10px] border-1 border-solid border-[var(--border)] p-[20px] z-41 flex flex-col gap-[10px]`}
        >
          <div>
            <Subtitle>
              {matchStory.length === 0
                ? `${fixtureObj.homeTeamDetails.name} vs 
              ${fixtureObj.awayTeamDetails.name}`
                : `${fixtureObj.homeTeamDetails.name} ${calculateScore(
                    matchStory.length - 1
                  )} 
              ${fixtureObj.awayTeamDetails.name}`}
            </Subtitle>
            <Paragraph style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              Fixture into result
            </Paragraph>
          </div>

          <ResultFormBasic
            fixture={fixtureObj}
            matchStory={matchStory}
            setMatchStory={setMatchStory}
            calculateScore={calculateScore}
          />

          <div className="flex flex-row justify-between">
            <Button
              color="var(--success)"
              bgHoverColor="var(--bg-light)"
              style={{ fontSize: '1rem' }}
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
            <Button
              color="var(--text-muted)"
              bgHoverColor="var(--bg-light)"
              style={{ fontSize: '1rem' }}
              onClick={() => setShowFixtureToResult(null)}
            >
              Close
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-[100vw] h-[100vh] fixed top-0 left-0 bg-black/60 z-40"
        ></motion.div>
      </AnimatePresence>
    </div>
  );
}

function ResultFormBasic({
  fixture,
  matchStory,
  setMatchStory,
  calculateScore,
}: {
  fixture: Fixture;
  matchStory: ('home' | 'away')[];
  setMatchStory: Dispatch<SetStateAction<('home' | 'away')[]>>;
  calculateScore: (i: number) => string;
}) {
  function addGoal(team: 'home' | 'away') {
    setMatchStory((prev) => [...prev, team]);
  }

  function removeGoal(index: number) {
    setMatchStory((prev) => {
      return prev.filter((_goal, i) => i !== index);
    });
  }
  return (
    <>
      <div className="max-h-[300px] min-h-[300px] overflow-auto ">
        <div className="flex flex-col gap-[8px] p-[8px] ">
          {matchStory.length === 0 ? (
            <Label style={{ placeSelf: 'center', color: 'var(--text-muted)' }}>
              No events
            </Label>
          ) : (
            matchStory.map((goal, i) => (
              <div
                key={i}
                className="w-full flex flex-row justify-between gap-[10px]"
              >
                <div
                  className={`w-full ${
                    goal === 'home' ? 'text-left' : 'text-right'
                  } `}
                >
                  <div>
                    <Label>
                      {goal === 'home'
                        ? fixture.homeTeamDetails.name
                        : fixture.awayTeamDetails.name}{' '}
                      ({calculateScore(i)})
                    </Label>
                  </div>
                </div>
                <Button
                  color="var(--danger)"
                  bgHoverColor="var(--bg-light)"
                  onClick={() => removeGoal(i)}
                  style={{
                    fontSize: '1rem',
                    height: 'min-content',
                    placeSelf: 'center',
                  }}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="grid grid-rows-1 grid-cols-2 w-full gap-[20px]">
          <Button
            color="var(--primary)"
            bgHoverColor="var(--accent)"
            onClick={() => addGoal('home')}
            style={{
              fontSize: '1rem',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            Add {fixture.homeTeamDetails.name} goal
          </Button>
          <Button
            color="var(--text)"
            bgHoverColor="var(--accent)"
            onClick={() => addGoal('away')}
            style={{
              fontSize: '1rem',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            Add {fixture.awayTeamDetails.name} goal
          </Button>
        </div>
      </div>
    </>
  );
}
