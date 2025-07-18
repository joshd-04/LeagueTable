import InfoSVG from '@/assets/svg components/Info';
import AddTablesForm from '@/components/forms/AddTablesForm';
import Heading1 from '@/components/text/Heading1';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import Subtitle from '@/components/text/Subtitle';

export default function AddTables({
  divisionsCount,
  leagueName,
  leagueId,
}: {
  divisionsCount: number;
  leagueName: string;
  leagueId: string;
}) {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        <Heading1>Division Setup</Heading1>
        <Subtitle style={{ marginTop: '-10px', color: 'var(--text-muted)' }}>
          {leagueName} - Part 2 of 3
        </Subtitle>
        <div className="grid grid-cols-3 grid-rows-1 w-[96vw] gap-[40px] pt-[40px]">
          <div></div>
          <AddTablesForm divisionsCount={divisionsCount} leagueId={leagueId} />
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
            <Label>Make sure the different table names are unique</Label>
            <span>
              <InfoSVG className="w-[32px] h-[32px] fill-[var(--info)] inline align-middle  " />{' '}
              <Paragraph
                style={{
                  color: 'var(--info)',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              >
                Promotion/relegation
              </Paragraph>
            </span>
            <Label>
              Make sure the promotion and relegation numbers match between
              adjacent leagues. First division promotions are automatically
              corrected to zero. Last division relegations are also corrected to
              zero
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
