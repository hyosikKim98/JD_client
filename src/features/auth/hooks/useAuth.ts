import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { configureApiClient } from '@/shared/api/apiClient';
import { tokenStorage } from '@/shared/storage/secureStorage';
import { authApi } from '../api/authApi';
import type { AuthUser, LoginRequestDto, SignUpRequestDto } from '../model/authTypes';
import { useAuthStore } from './useAuthStore';

// API 클라이언트 토큰 콜백을 인증 store와 연결하는 초기화 훅
// RootLayout에서 한 번 호출
export function useAuthSetup() {
  const store = useAuthStore.getState;

  configureApiClient({
    getAccessToken: () => store().accessToken,
    refreshTokens: async () => {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) throw new Error('리프레시 토큰 없음');
      const { accessToken, refreshToken: newRefresh } = await authApi.refreshAccessToken(refreshToken);
      await tokenStorage.saveTokens(accessToken, newRefresh);
      useAuthStore.getState().updateAccessToken(accessToken);
      return accessToken;
    },
    onAuthFailure: () => {
      tokenStorage.clearTokens().catch(() => null);
      useAuthStore.getState().setUnauthenticated();
    },
  });
}

// 앱 시작 시 저장된 토큰으로 세션 복구
export async function restoreSession(): Promise<void> {
  const { setAuthenticated, setUnauthenticated } = useAuthStore.getState();
  try {
    const accessToken = await tokenStorage.getAccessToken();
    if (!accessToken) {
      setUnauthenticated();
      return;
    }
    // 토큰 존재만으로 인증 완료로 가정하지 않고 /me 호출로 검증
    useAuthStore.getState().updateAccessToken(accessToken);
    const user = await authApi.getMe();
    setAuthenticated(
      { id: user.id, name: user.name, email: user.email, defaultCalendarId: user.defaultCalendarId },
      accessToken,
    );
  } catch {
    // 토큰이 만료됐거나 유효하지 않으면 갱신 시도는 apiClient 인터셉터가 처리
    // 갱신도 실패하면 onAuthFailure → setUnauthenticated
    // 여기서는 예외를 잡아서 unauthenticated로 처리
    setUnauthenticated();
  }
}

// 로그인/가입/로그아웃 액션 훅
export function useAuthActions() {
  const { setAuthenticated, setUnauthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const login = useCallback(
    async (credentials: LoginRequestDto): Promise<void> => {
      const { accessToken, refreshToken, user } = await authApi.login(credentials);
      await tokenStorage.saveTokens(accessToken, refreshToken);
      const authUser: AuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        defaultCalendarId: user.defaultCalendarId,
      };
      setAuthenticated(authUser, accessToken);
    },
    [setAuthenticated],
  );

  const signUp = useCallback(
    async (data: SignUpRequestDto): Promise<void> => {
      const { accessToken, refreshToken, user } = await authApi.signUp(data);
      await tokenStorage.saveTokens(accessToken, refreshToken);
      const authUser: AuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        defaultCalendarId: user.defaultCalendarId,
      };
      setAuthenticated(authUser, accessToken);
    },
    [setAuthenticated],
  );

  const logout = useCallback(async (): Promise<void> => {
    const refreshToken = await tokenStorage.getRefreshToken();
    // 로그아웃 API 실패해도 로컬 세션은 정리
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => null);
    }
    await tokenStorage.clearTokens();
    // 사용자별 쿼리 캐시 제거
    queryClient.clear();
    setUnauthenticated();
  }, [setUnauthenticated, queryClient]);

  return { login, signUp, logout };
}
