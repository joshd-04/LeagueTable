'use client';
import LoginForm from '@/components/forms/LoginForm';
import Heading1 from '@/components/text/Heading1';
import Subtitle from '@/components/text/Subtitle';
import useAccount from '@/hooks/useAccount';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'; // fallback

  const { isLoggedIn } = useAccount();
  const router = useRouter();
  if (isLoggedIn) {
    router.replace('/');
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="max-w-[40%] w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        <Heading1>Hop Back In</Heading1>
        <Subtitle style={{ marginTop: '-10px', color: 'var(--text-muted)' }}>
          Welcome back! We missed you!
        </Subtitle>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
