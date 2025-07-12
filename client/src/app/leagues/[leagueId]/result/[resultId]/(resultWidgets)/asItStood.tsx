import TeamForm from '@/components/teamForm/TeamForm';
import Paragraph from '@/components/text/Paragraph';
import { Result } from '@/util/definitions';
import ordinal from 'ordinal';

export default function AsItStood({ result }: { result: Result }) {
  return (
    <div className="p-[20px] h-full w-full  bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <Paragraph>Before the action started</Paragraph>
      <table className="table-fixed border-separate border-spacing-x-[20px] w-full">
        <thead>
          <tr>
            <th>
              <Paragraph style={{ textAlign: 'right' }}>
                {result.homeTeamDetails.name}
              </Paragraph>
            </th>
            <th></th>
            <th>
              <Paragraph style={{ textAlign: 'left' }}>
                {result.awayTeamDetails.name}
              </Paragraph>
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
              <Paragraph
                style={{ textAlign: 'center', color: 'var(--text-muted)' }}
              >
                Form
              </Paragraph>
            </td>
            <td>
              <div className="place-self-start">
                <TeamForm form={result.awayTeamDetails.form} />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <Paragraph style={{ textAlign: 'right' }}>
                {ordinal(result.homeTeamDetails.leaguePosition)}
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
                {ordinal(result.awayTeamDetails.leaguePosition)}
              </Paragraph>
            </td>
          </tr>
          <tr>
            <td>
              <Paragraph style={{ textAlign: 'right' }}>
                {result.homeTeamDetails.matchesPlayed}
              </Paragraph>
            </td>
            <td>
              <Paragraph
                style={{ textAlign: 'center', color: 'var(--text-muted)' }}
              >
                Matches played
              </Paragraph>
            </td>
            <td>
              <Paragraph style={{ textAlign: 'left' }}>
                {result.awayTeamDetails.matchesPlayed}
              </Paragraph>
            </td>
          </tr>
          <tr>
            <td>
              <Paragraph style={{ textAlign: 'right' }}>
                {result.homeTeamDetails.points}
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
                {result.awayTeamDetails.points}
              </Paragraph>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
