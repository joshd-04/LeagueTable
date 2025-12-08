'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function AuthSync({ children }: { children: React.ReactNode }) {
  // const queryClient = useQueryClient();

  // useEffect(() => {
  //   // Invalidate the account query programmatically
  //   console.log('INVALIDATING ACCOUNT QUERY. AUTH SYNC!');
  //   queryClient.invalidateQueries({ queryKey: ['account-fetch'] });
  // }, [queryClient]);

  return children;
}
