'use client';
import RegistrationForm from '@/components/forms/RegistrationForm';
import Heading1 from '@/components/text/Heading1';
import Subtitle from '@/components/text/Subtitle';

export default function Page() {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="max-w-[40%] w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        <Heading1>Join The Action</Heading1>
        <Subtitle style={{ marginTop: '-10px', color: 'var(--text-muted)' }}>
          Create a quick, free account to start making your first league
        </Subtitle>
        <RegistrationForm />
      </div>
    </div>
  );
}
