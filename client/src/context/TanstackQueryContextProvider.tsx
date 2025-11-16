'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function TanstackQueryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // ← THIS
        // refetchOnMount: false, // optional: only fetch if stale
        // refetchOnReconnect: false, // optional
        // staleTime: 5 * 60 * 1000, // 5 minutes — adjust as needed
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
