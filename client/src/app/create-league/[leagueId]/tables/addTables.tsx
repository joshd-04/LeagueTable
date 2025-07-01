import AddTablesForm from '@/components/forms/AddTablesForm';
import Heading1 from '@/components/text/Heading1';
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
      <div className="max-w-[40%] w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        <Heading1>Division Setup</Heading1>
        <Subtitle style={{ marginTop: '-10px', color: 'var(--text-muted)' }}>
          {leagueName} - Part 2 of 3
        </Subtitle>
        <AddTablesForm divisionsCount={divisionsCount} leagueId={leagueId} />
      </div>
    </div>
  );
}
