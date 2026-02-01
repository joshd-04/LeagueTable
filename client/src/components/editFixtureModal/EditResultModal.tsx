import { Dispatch, SetStateAction } from 'react';
import { Result } from '@/util/definitions';
import EditResultModalBasic from './(basic)/EditFixtureModalBasic';
import EditResultModalAdvanced from './(advanced)/EditResultModalAdvanced';

export default function EditResultModal({
  leagueType,
  resultObj,
  setSelectedResult,
  isModalOpen,
  onModalClose,
  invalidateDashboardQueries,
  onResolution,
}: {
  leagueType: 'basic' | 'advanced';
  resultObj: Result | null;
  setSelectedResult: Dispatch<SetStateAction<Result | null>>;
  isModalOpen: boolean;
  onModalClose?: () => void;
  invalidateDashboardQueries?: () => void;
  onResolution?: (isSuccess: boolean) => void;
}) {
  if (!resultObj) return null;
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
