import { Dispatch, SetStateAction } from 'react';
import { League, Result } from '@/util/definitions';
import EditResultModalBasic from './(basic)/EditResultModalBasic';
import EditResultModalAdvanced from './(advanced)/EditResultModalAdvanced';
import useAccount from '@/hooks/useAccount';
import { doesUserOwnThisLeague } from '@/util/helpers';

export default function EditResultModal({
  league,
  resultObj,
  setSelectedResult,
  isModalOpen,
  onModalClose,
  invalidateDashboardQueries,
  onResolution,
}: {
  league: League;
  resultObj: Result | null;
  setSelectedResult: Dispatch<SetStateAction<Result | null>>;
  isModalOpen: boolean;
  onModalClose?: () => void;
  invalidateDashboardQueries?: () => void;
  onResolution?: (isSuccess: boolean) => void;
}) {
  const { isLoggedIn, user } = useAccount();
  const userOwnsThisLeague = doesUserOwnThisLeague(league, user, isLoggedIn);

  if (!userOwnsThisLeague) return null;

  if (!resultObj) return null;

  const leagueType = league.leagueType;
  if (leagueType === 'advanced') {
    return (
      <EditResultModalAdvanced
        resultObj={resultObj}
        isModalOpen={isModalOpen}
        onModalClose={onModalClose}
        setSelectedResult={setSelectedResult}
        invalidateDashboardQueries={invalidateDashboardQueries}
        onResolution={onResolution}
      />
    );
  }
  return (
    <EditResultModalBasic
      resultObj={resultObj}
      isModalOpen={isModalOpen}
      onModalClose={onModalClose}
      setSelectedResult={setSelectedResult}
      invalidateDashboardQueries={invalidateDashboardQueries}
      onResolution={onResolution}
    />
  );
}
