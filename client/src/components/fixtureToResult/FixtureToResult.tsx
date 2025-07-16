import { Dispatch, SetStateAction } from 'react';
import { Fixture } from '@/util/definitions';
import FixtureToResultAdvanced from './(advanced)/FixtureToResultAdvanced';
import FixtureToResultBasic from './(basic)/FixtureToResultBasic';

export default function FixtureToResult({
  leagueType,
  fixtureObj,
  setShowFixtureToResult,
  invalidateDashboardQueries,
}: {
  leagueType: 'basic' | 'advanced';
  fixtureObj: Fixture;
  setShowFixtureToResult: Dispatch<SetStateAction<Fixture | null>>;
  invalidateDashboardQueries: () => void;
}) {
  if (leagueType === 'advanced') {
    return (
      <FixtureToResultAdvanced
        fixtureObj={fixtureObj}
        setShowFixtureToResult={setShowFixtureToResult}
        invalidateDashboardQueries={invalidateDashboardQueries}
      />
    );
  }
  return (
    <FixtureToResultBasic
      fixtureObj={fixtureObj}
      setShowFixtureToResult={setShowFixtureToResult}
      invalidateDashboardQueries={invalidateDashboardQueries}
    />
  );
}
