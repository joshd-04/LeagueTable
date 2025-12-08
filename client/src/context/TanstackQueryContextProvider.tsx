'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function TanstackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create QueryClient ONCE per client-side session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false, // We'll handle this manually
            refetchOnMount: false, // Don't auto-refetch on component mount
            refetchOnReconnect: true, // Do refetch on network reconnect
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
