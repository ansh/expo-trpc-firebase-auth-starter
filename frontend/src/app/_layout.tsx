import { QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';

import { AuthProvider } from '../lib/auth/AuthContext';

import ToastProvider from '@/components/Toast';
import { queryClient, trpcQuery, trpcQueryClient } from '@/lib/config/api';

export {
  // Catch any errors thrown by the Layout component
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present
  initialRouteName: '(app)/(tabs)',
};

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
