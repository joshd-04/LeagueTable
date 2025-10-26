import { Dispatch, SetStateAction } from 'react';
import { Fixture } from '@/util/definitions';
import FixtureToResultAdvanced from './(advanced)/FixtureToResultAdvanced';
import FixtureToResultBasic from './(basic)/FixtureToResultBasic';

export default function FixtureToResult({
  leagueType,
  fixtureObj,
  setShowFixtureToResult,
  invalidateDashboardQueries,
  onResolution,
}: {
  leagueType: 'basic' | 'advanced';
  fixtureObj: Fixture;
  setShowFixtureToResult: Dispatch<SetStateAction<Fixture | null>>;
  invalidateDashboardQueries?: () => void;
  onResolution?: (isSuccess: boolean) => void;
}) {
  if (leagueType === 'advanced') {
    return (
      <FixtureToResultAdvanced
        fixtureObj={fixtureObj}
        setShowFixtureToResult={setShowFixtureToResult}
        invalidateDashboardQueries={invalidateDashboardQueries}
        onResolution={onResolution}
      />
    );
  }
  return (
    <FixtureToResultBasic
      fixtureObj={fixtureObj}
      setShowFixtureToResult={setShowFixtureToResult}
      invalidateDashboardQueries={invalidateDashboardQueries}
      onResolution={onResolution}
    />
  );
}
