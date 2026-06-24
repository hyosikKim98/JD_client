// 서버 DTO
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface SignUpRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  defaultCalendarId: string | null;
  createdAt: string;
}

// 앱 내부 모델 (DTO와 분리)
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  defaultCalendarId: string | null;
}

// 세션 상태 — 앱 시작 복구 전/완료/미인증 구분
export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthSession {
  status: SessionStatus;
  user: AuthUser | null;
  // 액세스 토큰은 메모리에만 유지 (SecureStore → 앱 시작 시 한 번 읽음)
  accessToken: string | null;
}
