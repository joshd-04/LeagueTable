'use client';
import AutoSignIn from '@/components/autoSignIn/AutoSignIn';
import CreateLeagueForm from '@/components/forms/CreateLeagueForm';
import Heading1 from '@/components/text/Heading1';
import Subtitle from '@/components/text/Subtitle';
import useAccount from '@/hooks/useAccount';

export default function Page() {
  const { performAutoSignIn } = useAccount();

  if (performAutoSignIn) return <AutoSignIn />;
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="max-w-[40%] w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        <Heading1>Create A League</Heading1>
        <Subtitle style={{ marginTop: '-10px', color: 'var(--text-muted)' }}>
          League Setup - Part 1 of 3
        </Subtitle>
        <CreateLeagueForm />
      </div>
    </div>
  );
}
