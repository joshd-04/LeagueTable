'use client';
import LoginForm from '@/components/forms2/LoginForm';
import { Spacer } from '@heroui/react';
import { useSearchParams } from 'next/navigation';

export default function LoginClient() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'; // fallback

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="max-w-[40%] w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        <Spacer y={10} />
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
