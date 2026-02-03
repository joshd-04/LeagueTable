import { Dispatch, SetStateAction } from 'react';
import { League } from '@/util/definitions';
import FixtureToResultBasic from './(basic)/FixtureToResultBasic';
import FixtureToResultAdvanced from './(advanced)/FixtureToResultAdvanced';
import useAccount from '@/hooks/useAccount';
import { doesUserOwnThisLeague } from '@/util/helpers';
import { SingleFixtureDTO } from '@/util/dto/fixtures';

export default function FixtureToResult({
  league,
  fixtureObj,
  setSelectedFixture,
  isModalOpen,
  onModalClose,
  invalidateDashboardQueries,
  onResolution,
}: {
  league: League;
  fixtureObj: SingleFixtureDTO | null;
  setSelectedFixture: Dispatch<SetStateAction<SingleFixtureDTO | null>>;
  isModalOpen: boolean;
  onModalClose?: () => void;
  invalidateDashboardQueries?: () => void;
  onResolution?: (isSuccess: boolean) => void;
}) {
  const { isLoggedIn, user } = useAccount();
  const userOwnsThisLeague = doesUserOwnThisLeague(league, user, isLoggedIn);

  if (!userOwnsThisLeague) return null;
  if (!fixtureObj) return null;

  const leagueType = league.leagueType;
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
