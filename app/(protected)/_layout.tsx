import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { LoadingState } from '@/shared/components/LoadingState';

// 미인증 사용자가 보호 라우트에 접근하면 로그인으로 리다이렉트
export default function ProtectedLayout() {
  const status = useAuthStore((s) => s.status);

  if (status === 'loading') {
    return <LoadingState message="잠깐, 확인 중이에요" />;
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/(public)/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
