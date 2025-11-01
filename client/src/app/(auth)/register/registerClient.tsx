'use client';
import RegistrationFormOld from '@/components/forms/RegistrationForm';
import RegistrationForm from '@/components/forms2/RegistrationForm';
import Heading1 from '@/components/text/Heading1';
import Subtitle from '@/components/text/Subtitle';

export default function RegisterClient() {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="max-w-[40%] w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        <Heading1>Join the action</Heading1>
        <Subtitle
          style={{ marginTop: '-10px' }}
          className="opacity-80 dark:opacity-70 text-center"
        >
          Create a quick, free account to start making your first league
        </Subtitle>
        {/* <RegistrationFormOld /> */}
        <RegistrationForm />
      </div>
    </div>
  );
}
