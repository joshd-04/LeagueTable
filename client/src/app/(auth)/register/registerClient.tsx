'use client';
import RegistrationForm from '@/components/forms/RegistrationForm';
import { Spacer } from '@heroui/react';

export default function RegisterClient() {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="max-w-[40%] w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        <Spacer y={10} />
        <RegistrationForm />
      </div>
    </div>
  );
}
