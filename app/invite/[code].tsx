import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { LoadingState } from '@/shared/components/LoadingState';

// 초대 링크 진입점 — 로그인 여부에 따라 분기
// Stage 3 그룹 기능에서 미리보기 화면으로 연결 예정
export default function InviteCodeRoute() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const status = useAuthStore((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      // 로그인 전 초대 코드 보존 후 인증 화면으로 이동 (Stage 3에서 복원 로직 추가 예정)
      // TODO: 코드를 임시 저장하고 로그인 후 복원
      router.replace('/(public)/sign-in');
    } else {
      // 인증 완료 — 그룹 참여 미리보기로 이동 (Stage 3 구현 예정)
      // TODO: /(protected)/groups/join?code=... 로 이동
      router.replace('/(protected)/');
    }
  }, [status, code, router]);

  return <LoadingState message="초대 링크 확인 중이에요" />;
}
