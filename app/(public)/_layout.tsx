import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { LoadingState } from '@/shared/components/LoadingState';

// 인증된 사용자가 로그인 화면에 접근하면 홈으로 리다이렉트
export default function PublicLayout() {
  const status = useAuthStore((s) => s.status);

  if (status === 'loading') {
    return <LoadingState message="잠깐, 확인 중이에요" />;
  }

  if (status === 'authenticated') {
    return <Redirect href="/(protected)/" />;
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
