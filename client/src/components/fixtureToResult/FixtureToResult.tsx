import { Dispatch, SetStateAction } from 'react';
import { Fixture } from '@/util/definitions';
import FixtureToResultBasic from './(basic)/FixtureToResultBasic';
import FixtureToResultAdvanced from './(advanced)/FixtureToResultAdvanced';

export default function FixtureToResult({
  leagueType,
  fixtureObj,
  setSelectedFixture,
  isModalOpen,
  onModalClose,
  invalidateDashboardQueries,
  onResolution,
}: {
  leagueType: 'basic' | 'advanced';
  fixtureObj: Fixture | null;
  setSelectedFixture: Dispatch<SetStateAction<Fixture | null>>;
  isModalOpen: boolean;
  onModalClose?: () => void;
  invalidateDashboardQueries?: () => void;
  onResolution?: (isSuccess: boolean) => void;
}) {
  if (!fixtureObj) return null;
  if (leagueType === 'advanced') {
    return (
      <FixtureToResultAdvanced
        fixtureObj={fixtureObj}
        isModalOpen={isModalOpen}
        onModalClose={onModalClose}
        setSelectedFixture={setSelectedFixture}
        invalidateDashboardQueries={invalidateDashboardQueries}
        onResolution={onResolution}
      />
    );
  }
  return (
    <FixtureToResultBasic
      fixtureObj={fixtureObj}
      isModalOpen={isModalOpen}
      onModalClose={onModalClose}
      setSelectedFixture={setSelectedFixture}
      invalidateDashboardQueries={invalidateDashboardQueries}
      onResolution={onResolution}
    />
  );
}
