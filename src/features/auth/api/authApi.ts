import { apiPost } from '@/shared/api/apiClient';
import type {
  AuthResponseDto,
  LoginRequestDto,
  SignUpRequestDto,
  UserDto,
} from '../model/authTypes';

export const authApi = {
  login(body: LoginRequestDto): Promise<AuthResponseDto> {
    return apiPost<AuthResponseDto>('/api/v1/auth/login', body);
  },

  signUp(body: SignUpRequestDto): Promise<AuthResponseDto> {
    return apiPost<AuthResponseDto>('/api/v1/auth/signup', body);
  },

  // 리프레시 토큰으로 액세스 토큰 재발급
  // Authorization 헤더 없이 직접 axios 호출 (인터셉터 루프 방지 목적으로 별도 처리)
  refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    return apiPost('/api/v1/auth/refresh', { refreshToken });
  },

  getMe(): Promise<UserDto> {
    return apiPost<UserDto>('/api/v1/auth/me', undefined);
  },

  logout(refreshToken: string): Promise<void> {
    return apiPost('/api/v1/auth/logout', { refreshToken });
  },
};
