import TeamForm from '@/components/teamForm/TeamForm';
import { Result } from '@/util/definitions';
import ordinal from 'ordinal';

export default function AsItStood({ result }: { result: Result }) {
  return (
    <div className="p-[20px] h-full w-full  bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <p className="text-base">Before the action started</p>
      <table className="table-fixed border-separate border-spacing-x-[20px] w-full">
        <thead>
          <tr>
            <th>
              <p className="text-base text-right">
                {result.homeTeamDetails.name}
              </p>
            </th>
            <th></th>
            <th>
              <p className="text-base text-left">
                {result.awayTeamDetails.name}
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="place-self-end">
                <TeamForm form={result.homeTeamDetails.form} />
              </div>
            </td>
            <td>
              <p className="text-center text-base  text-muted">Form</p>
            </td>
            <td>
              <div className="place-self-start">
                <TeamForm form={result.awayTeamDetails.form} />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-right text-base">
                {ordinal(result.homeTeamDetails.leaguePosition)}
              </p>
            </td>
            <td>
              <p className="text-center text-base text-muted">Position</p>
            </td>
            <td>
              <p className="text-left text-base">
                {ordinal(result.awayTeamDetails.leaguePosition)}
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-right text-base">
                {result.homeTeamDetails.matchesPlayed}
              </p>
            </td>
            <td>
              <p className="text-center text-base text-muted">Matches played</p>
            </td>
            <td>
              <p className="text-left text-base">
                {result.awayTeamDetails.matchesPlayed}
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-right text-base">
                {result.homeTeamDetails.points}
              </p>
            </td>
            <td>
              <p className="text-center text-base text-muted">Points</p>
            </td>
            <td>
              <p className="text-left text-base">
                {result.awayTeamDetails.points}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
