import { useAuthStore } from '../useAuthStore';

const mockUser = {
  id: 'user-1',
  name: '홍길동',
  email: 'user@example.com',
  defaultCalendarId: null,
};

beforeEach(() => {
  useAuthStore.setState({ status: 'loading', user: null, accessToken: null });
});

describe('useAuthStore', () => {
  it('초기 상태는 loading이다', () => {
    const { status, user, accessToken } = useAuthStore.getState();
    expect(status).toBe('loading');
    expect(user).toBeNull();
    expect(accessToken).toBeNull();
  });

  it('setAuthenticated는 상태를 authenticated로 바꾼다', () => {
    useAuthStore.getState().setAuthenticated(mockUser, 'access-token-abc');
    const { status, user, accessToken } = useAuthStore.getState();
    expect(status).toBe('authenticated');
    expect(user).toEqual(mockUser);
    expect(accessToken).toBe('access-token-abc');
  });

  it('setUnauthenticated는 세션을 초기화한다', () => {
    useAuthStore.getState().setAuthenticated(mockUser, 'access-token-abc');
    useAuthStore.getState().setUnauthenticated();
    const { status, user, accessToken } = useAuthStore.getState();
    expect(status).toBe('unauthenticated');
    expect(user).toBeNull();
    expect(accessToken).toBeNull();
  });

  it('updateAccessToken은 토큰만 교체한다', () => {
    useAuthStore.getState().setAuthenticated(mockUser, 'old-token');
    useAuthStore.getState().updateAccessToken('new-token');
    const { status, user, accessToken } = useAuthStore.getState();
    expect(status).toBe('authenticated');
    expect(user).toEqual(mockUser);
    expect(accessToken).toBe('new-token');
  });
});
