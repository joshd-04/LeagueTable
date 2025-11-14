import TeamForm from '@/components/teamForm/TeamForm';
import { Fixture } from '@/util/definitions';
import ordinal from 'ordinal';

export default function MatchPreview({ fixture }: { fixture: Fixture }) {
  return (
    <div className="p-[20px] h-full w-full col-span-1 bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <p className="text-medium">Match preview</p>
      <PreviewTable fixture={fixture} />
    </div>
  );
}

function PreviewTable({ fixture }: { fixture: Fixture }) {
  const homeGD =
    fixture.homeTeamDetails.goalsFor - fixture.homeTeamDetails.goalsAgainst;
  const awayGD =
    fixture.awayTeamDetails.goalsFor - fixture.awayTeamDetails.goalsAgainst;
  return (
    <table className="table-fixed border-separate border-spacing-x-[20px] w-full">
      <thead>
        <tr>
          <th>
            <p className="text-medium text-right">
              {fixture.homeTeamDetails.name}
            </p>
          </th>
          <th></th>
          <th>
            <p className="text-medium text-left">
              {fixture.awayTeamDetails.name}
            </p>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div className="place-self-end">
              <TeamForm form={fixture.homeTeamDetails.form} />
            </div>
          </td>
          <td>
            <p
              style={{ color: 'var(--text-muted)' }}
              className="text-center text-medium"
            >
              Form
            </p>
          </td>
          <td>
            <div className="place-self-start">
              <TeamForm form={fixture.awayTeamDetails.form} />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <p className="text-right text-medium">
              {ordinal(fixture.homeTeamDetails.position)}
            </p>
          </td>
          <td>
            <p
              style={{ color: 'var(--text-muted)' }}
              className="text-center text-medium"
            >
              Position
            </p>
          </td>
          <td>
            <p className="text-left text-medium">
              {ordinal(fixture.awayTeamDetails.position)}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="text-right text-medium">
              {fixture.homeTeamDetails.wins * 3 + fixture.homeTeamDetails.draws}
            </p>
          </td>
          <td>
            <p
              style={{ color: 'var(--text-muted)' }}
              className="text-medium text-center"
            >
              Points
            </p>
          </td>
          <td>
            <p className="text-left text-medium">
              {fixture.awayTeamDetails.wins * 3 + fixture.awayTeamDetails.draws}
            </p>
          </td>
        </tr>

        <tr>
          <td>
            <p className="text-right text-medium">
              {fixture.homeTeamDetails.wins}
            </p>
          </td>
          <td>
            <p
              className="text-center text-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Wins
            </p>
          </td>
          <td>
            <p className="text-left text-medium">
              {fixture.awayTeamDetails.wins}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="text-right text-medium">
              {fixture.homeTeamDetails.draws}
            </p>
          </td>
          <td>
            <p
              className="text-center text-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Draws
            </p>
          </td>
          <td>
            <p className="text-left text-medium">
              {fixture.awayTeamDetails.draws}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="text-right text-medium">
              {fixture.homeTeamDetails.losses}
            </p>
          </td>
          <td>
            <p
              className="text-center text-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Losses
            </p>
          </td>
          <td>
            <p className="text-left text-medium">
              {fixture.awayTeamDetails.losses}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="text-right text-medium">
              {fixture.homeTeamDetails.goalsFor}
            </p>
          </td>
          <td>
            <p
              className="text-center text-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Goals scored
            </p>
          </td>
          <td>
            <p className="text-left text-medium">
              {fixture.awayTeamDetails.goalsAgainst}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="text-right text-medium">
              {homeGD > 0 ? `+${homeGD}` : homeGD}
            </p>
          </td>
          <td>
            <p
              className="text-center text-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Goal Diff
            </p>
          </td>
          <td>
            <p className="text-left text-medium">
              {awayGD > 0 ? `+${awayGD}` : homeGD}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
