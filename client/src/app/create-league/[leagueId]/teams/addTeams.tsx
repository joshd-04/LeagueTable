import InfoSVG from '@/assets/svg components/Info';
import AddTeamsForm from '@/components/forms/AddTeamsForm';
import Heading1 from '@/components/text/Heading1';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import Subtitle from '@/components/text/Subtitle';

export default function AddTeams({
  divisions,
  leagueName,
  leagueId,
}: {
  divisions: { divisionNumber: number; name: string; numberOfTeams: number }[];
  leagueName: string;
  leagueId: string;
}) {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        <Heading1>Teams Setup</Heading1>
        <Subtitle style={{ marginTop: '-10px', color: 'var(--text-muted)' }}>
          {leagueName} - Part 3 of 3
        </Subtitle>
        <div className="grid grid-cols-3 grid-rows-1 w-[96vw] gap-[40px] pt-[40px]">
          <div></div>
          <AddTeamsForm divisions={divisions} leagueId={leagueId} />
          <div className="p-[20px] max-w-[80%] h-min w-fit bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
            <span>
              <InfoSVG className="w-[32px] h-[32px] fill-[var(--info)] inline align-middle  " />{' '}
              <Paragraph
                style={{
                  color: 'var(--info)',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              >
                Table names
              </Paragraph>
            </span>
            <Label style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}>
              Make sure the different table names are unique
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
