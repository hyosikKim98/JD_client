import { normalizeHttpError, toUserMessage } from '../errors';

describe('normalizeHttpError', () => {
  it('401은 unauthorized를 반환한다', () => {
    expect(normalizeHttpError(401, null)).toEqual({ type: 'unauthorized', retryable: false });
  });

  it('403은 forbidden을 반환한다', () => {
    expect(normalizeHttpError(403, null)).toEqual({ type: 'forbidden', retryable: false });
  });

  it('404는 notFound를 반환한다', () => {
    expect(normalizeHttpError(404, null)).toEqual({ type: 'notFound', code: undefined });
  });

  it('404에 code가 있으면 code를 포함한다', () => {
    expect(normalizeHttpError(404, { code: 'GROUP_NOT_FOUND' })).toEqual({
      type: 'notFound',
      code: 'GROUP_NOT_FOUND',
    });
  });

  it('409는 conflict를 반환한다', () => {
    expect(normalizeHttpError(409, { code: 'DUPLICATE_EMAIL' })).toEqual({
      type: 'conflict',
      code: 'DUPLICATE_EMAIL',
    });
  });

  it('422는 validation을 반환한다', () => {
    expect(normalizeHttpError(422, null)).toEqual({ type: 'validation', fields: undefined });
  });

  it('422에 fields가 있으면 포함한다', () => {
    const data = { fields: { email: '이메일 형식이 올바르지 않아요' } };
    const result = normalizeHttpError(422, data);
    expect(result).toEqual({ type: 'validation', fields: data.fields });
  });

  it('500은 server를 반환한다', () => {
    expect(normalizeHttpError(500, null)).toEqual({ type: 'server', retryable: true });
  });

  it('알 수 없는 상태는 unknown을 반환한다', () => {
    expect(normalizeHttpError(418, null)).toEqual({ type: 'unknown', retryable: false });
  });
});

describe('toUserMessage', () => {
  it('network 오류에 안전한 메시지를 반환한다', () => {
    const msg = toUserMessage({ type: 'network', retryable: true });
    expect(msg).toContain('인터넷');
  });

  it('unauthorized 오류에 안전한 메시지를 반환한다', () => {
    const msg = toUserMessage({ type: 'unauthorized', retryable: false });
    expect(msg).toContain('로그인');
  });

  it('서버 내부 메시지를 직접 노출하지 않는다', () => {
    const msg = toUserMessage({ type: 'server', retryable: true });
    expect(msg).not.toContain('stack');
    expect(msg).not.toContain('Error');
  });
});
