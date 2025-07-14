import TeamForm from '@/components/teamForm/TeamForm';
import Paragraph from '@/components/text/Paragraph';
import { Fixture } from '@/util/definitions';
import ordinal from 'ordinal';

export default function PreviewTable({ fixture }: { fixture: Fixture }) {
  const homeGD =
    fixture.homeTeamDetails.goalsFor - fixture.homeTeamDetails.goalsAgainst;
  const awayGD =
    fixture.awayTeamDetails.goalsFor - fixture.awayTeamDetails.goalsAgainst;
  return (
    <table className="table-fixed border-separate border-spacing-x-[20px] w-full">
      <thead>
        <tr>
          <th>
            <Paragraph style={{ textAlign: 'right' }}>
              {fixture.homeTeamDetails.name}
            </Paragraph>
          </th>
          <th></th>
          <th>
            <Paragraph style={{ textAlign: 'left' }}>
              {fixture.awayTeamDetails.name}
            </Paragraph>
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
            <Paragraph
              style={{ textAlign: 'center', color: 'var(--text-muted)' }}
            >
              Form
            </Paragraph>
          </td>
          <td>
            <div className="place-self-start">
              <TeamForm form={fixture.awayTeamDetails.form} />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <Paragraph style={{ textAlign: 'right' }}>
              {ordinal(fixture.homeTeamDetails.position)}
            </Paragraph>
          </td>
          <td>
            <Paragraph
              style={{ textAlign: 'center', color: 'var(--text-muted)' }}
            >
              Position
            </Paragraph>
          </td>
          <td>
            <Paragraph style={{ textAlign: 'left' }}>
              {ordinal(fixture.awayTeamDetails.position)}
            </Paragraph>
          </td>
        </tr>
        <tr>
          <td>
            <Paragraph style={{ textAlign: 'right' }}>
              {fixture.homeTeamDetails.wins * 3 + fixture.homeTeamDetails.draws}
            </Paragraph>
          </td>
          <td>
            <Paragraph
              style={{ textAlign: 'center', color: 'var(--text-muted)' }}
            >
              Points
            </Paragraph>
          </td>
          <td>
            <Paragraph style={{ textAlign: 'left' }}>
              {fixture.awayTeamDetails.wins * 3 + fixture.awayTeamDetails.draws}
            </Paragraph>
          </td>
        </tr>

        <tr>
          <td>
            <Paragraph style={{ textAlign: 'right' }}>
              {fixture.homeTeamDetails.wins}
            </Paragraph>
          </td>
          <td>
            <Paragraph
              style={{ textAlign: 'center', color: 'var(--text-muted)' }}
            >
              Wins
            </Paragraph>
          </td>
          <td>
            <Paragraph style={{ textAlign: 'left' }}>
              {fixture.awayTeamDetails.wins}
            </Paragraph>
          </td>
        </tr>
        <tr>
          <td>
            <Paragraph style={{ textAlign: 'right' }}>
              {fixture.homeTeamDetails.draws}
            </Paragraph>
          </td>
          <td>
            <Paragraph
              style={{ textAlign: 'center', color: 'var(--text-muted)' }}
            >
              Draws
            </Paragraph>
          </td>
          <td>
            <Paragraph style={{ textAlign: 'left' }}>
              {fixture.awayTeamDetails.draws}
            </Paragraph>
          </td>
        </tr>
        <tr>
          <td>
            <Paragraph style={{ textAlign: 'right' }}>
              {fixture.homeTeamDetails.losses}
            </Paragraph>
          </td>
          <td>
            <Paragraph
              style={{ textAlign: 'center', color: 'var(--text-muted)' }}
            >
              Losses
            </Paragraph>
          </td>
          <td>
            <Paragraph style={{ textAlign: 'left' }}>
              {fixture.awayTeamDetails.losses}
            </Paragraph>
          </td>
        </tr>
        <tr>
          <td>
            <Paragraph style={{ textAlign: 'right' }}>
              {fixture.homeTeamDetails.goalsFor}
            </Paragraph>
          </td>
          <td>
            <Paragraph
              style={{ textAlign: 'center', color: 'var(--text-muted)' }}
            >
              Goals scored
            </Paragraph>
          </td>
          <td>
            <Paragraph style={{ textAlign: 'left' }}>
              {fixture.awayTeamDetails.goalsAgainst}
            </Paragraph>
          </td>
        </tr>
        <tr>
          <td>
            <Paragraph style={{ textAlign: 'right' }}>
              {homeGD > 0 ? `+${homeGD}` : homeGD}
            </Paragraph>
          </td>
          <td>
            <Paragraph
              style={{ textAlign: 'center', color: 'var(--text-muted)' }}
            >
              Goal Diff
            </Paragraph>
          </td>
          <td>
            <Paragraph style={{ textAlign: 'left' }}>
              {awayGD > 0 ? `+${awayGD}` : homeGD}
            </Paragraph>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
