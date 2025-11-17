// app/error.tsx  → 500 page (client-side errors + server errors in dev)
'use client';

import { Button } from '@heroui/react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Caught in error boundary:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="mt-4 text-muted-foreground">
        We&apos;re having trouble loading this page right now.
      </p>
      <Button onPress={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
