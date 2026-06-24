import { create } from 'zustand';
import type { AuthSession, AuthUser } from '../model/authTypes';

interface AuthStore extends AuthSession {
  setAuthenticated: (user: AuthUser, accessToken: string) => void;
  setUnauthenticated: () => void;
  setLoading: () => void;
  updateAccessToken: (token: string) => void;
}

// 인증 세션 전역 상태 — 서버 데이터 캐시가 아닌 세션 메타 정보만 보관
export const useAuthStore = create<AuthStore>((set) => ({
  status: 'loading',
  user: null,
  accessToken: null,

  setAuthenticated: (user, accessToken) =>
    set({ status: 'authenticated', user, accessToken }),

  setUnauthenticated: () =>
    set({ status: 'unauthenticated', user: null, accessToken: null }),

  setLoading: () => set({ status: 'loading' }),

  updateAccessToken: (token) => set({ accessToken: token }),
}));
