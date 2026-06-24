import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthSetup, restoreSession } from '@/features/auth/hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // GET 요청만 재시도, mutation은 재시도 안 함
      retry: (failureCount, error) => {
        // ApiError unauthorized/forbidden은 재시도 불필요
        if (
          error instanceof Error &&
          error.name === 'ApiError'
        ) return false;
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5, // 5분
    },
    mutations: {
      retry: false,
    },
  },
});

function AppBootstrap({ children }: { children: React.ReactNode }) {
  useAuthSetup();

  useEffect(() => {
    restoreSession();
  }, []);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppBootstrap>
            <Stack screenOptions={{ headerShown: false }} />
          </AppBootstrap>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
