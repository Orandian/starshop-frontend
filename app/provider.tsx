'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useUserStore } from '@/store/useAuthStore';
import { setQueryClient } from '@/utils';

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const initialize = useUserStore((state) => state.initialize);

  useEffect(() => {
    initialize();
     setQueryClient(client);
  }, [initialize,client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}