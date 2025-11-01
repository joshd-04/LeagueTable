'use client';
import LoginForm from '@/components/forms2/LoginForm';
import Heading1 from '@/components/text/Heading1';
import Subtitle from '@/components/text/Subtitle';
import { useSearchParams } from 'next/navigation';

export default function LoginClient() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'; // fallback

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="max-w-[40%] w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        <Heading1>Hop back in</Heading1>

        <Subtitle
          style={{ marginTop: '-10px' }}
          className="opacity-80 dark:opacity-70"
        >
          Welcome back! We missed you!
        </Subtitle>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
