import { League } from '@/util/definitions';
import EditResultModalBasic from './(basic)/EditResultModalBasic';
import EditResultModalAdvanced from './(advanced)/EditResultModalAdvanced';
import useAccount from '@/hooks/useAccount';
import { doesUserOwnThisLeague } from '@/util/helpers';
import { SingleResultDTO } from '@/util/dto/results';

export default function EditResultModal({
  league,
  resultObj,
  isModalOpen,
  onModalClose,
  invalidateDashboardQueries,
  onResolution,
}: {
  league: League;
  resultObj: SingleResultDTO | null;
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
      invalidateDashboardQueries={invalidateDashboardQueries}
      onResolution={onResolution}
    />
  );
}
