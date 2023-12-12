import { QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';

import { AuthProvider } from '../lib/auth/AuthContext';

import ToastProvider from '@/components/Toast';
import { queryClient, trpcQuery, trpcQueryClient } from '@/lib/config/api';

export default function Root() {
  return (
    <AuthProvider>
      <trpcQuery.Provider client={trpcQueryClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Slot />
          <ToastProvider />
        </QueryClientProvider>
      </trpcQuery.Provider>
    </AuthProvider>
  );
}
