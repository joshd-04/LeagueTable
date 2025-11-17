// app/global-error.tsx  → Catches even layout/server crashes (optional but nice)
'use client';

export default function GlobalError({ error }: { error: Error }) {
  console.error(error.message);
  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold">Oops! Server is down</h1>
        <p>We&apos;ll be back shortly. Thanks for your patience.</p>
      </body>
    </html>
  );
}
