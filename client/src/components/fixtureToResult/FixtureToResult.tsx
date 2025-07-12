import { Dispatch, SetStateAction } from 'react';
import { Fixture } from '@/util/definitions';
import FixtureToResultAdvanced from './(advanced)/FixtureToResultAdvanced';
import FixtureToResultBasic from './(basic)/FixtureToResultBasic';

export default function FixtureToResult({
  leagueType,
  fixtureObj,
  setShowFixtureToResult,
  fetchLatestData,
}: {
  leagueType: 'basic' | 'advanced';
  fixtureObj: Fixture;
  setShowFixtureToResult: Dispatch<SetStateAction<Fixture | null>>;
  fetchLatestData?: () => Promise<void>;
}) {
  if (leagueType === 'advanced') {
    return (
      <FixtureToResultAdvanced
        fixtureObj={fixtureObj}
        setShowFixtureToResult={setShowFixtureToResult}
        fetchLatestData={fetchLatestData}
      />
    );
  }
  return (
    <FixtureToResultBasic
      fixtureObj={fixtureObj}
      setShowFixtureToResult={setShowFixtureToResult}
      fetchLatestData={fetchLatestData}
    />
  );
}
