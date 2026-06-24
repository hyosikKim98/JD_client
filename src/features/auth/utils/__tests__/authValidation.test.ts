import { signInSchema, signUpSchema } from '../authValidation';

describe('signInSchema', () => {
  it('유효한 이메일과 비밀번호를 통과시킨다', () => {
    const result = signInSchema.safeParse({ email: 'user@example.com', password: 'secret123' });
    expect(result.success).toBe(true);
  });

  it('이메일이 비어있으면 실패한다', () => {
    const result = signInSchema.safeParse({ email: '', password: 'secret123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors['email']).toBeDefined();
    }
  });

  it('이메일 형식이 틀리면 실패한다', () => {
    const result = signInSchema.safeParse({ email: 'not-an-email', password: 'secret123' });
    expect(result.success).toBe(false);
  });

  it('비밀번호가 비어있으면 실패한다', () => {
    const result = signInSchema.safeParse({ email: 'user@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('signUpSchema', () => {
  const valid = {
    name: '홍길동',
    email: 'user@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
  };

  it('유효한 입력을 통과시킨다', () => {
    const result = signUpSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('이름이 비어있으면 실패한다', () => {
    const result = signUpSchema.safeParse({ ...valid, name: '' });
    expect(result.success).toBe(false);
  });

  it('이름이 20자를 초과하면 실패한다', () => {
    const result = signUpSchema.safeParse({ ...valid, name: 'a'.repeat(21) });
    expect(result.success).toBe(false);
  });

  it('비밀번호가 8자 미만이면 실패한다', () => {
    const result = signUpSchema.safeParse({ ...valid, password: '1234567', passwordConfirm: '1234567' });
    expect(result.success).toBe(false);
  });

  it('비밀번호 확인이 다르면 실패한다', () => {
    const result = signUpSchema.safeParse({ ...valid, passwordConfirm: 'different' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors['passwordConfirm']).toBeDefined();
    }
  });
});
