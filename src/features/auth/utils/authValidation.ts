import { z } from 'zod';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해 주세요.')
    .regex(EMAIL_REGEX, '올바른 이메일 형식이 아니에요.'),
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해 주세요.')
    .max(20, '이름은 20자 이하로 입력해 주세요.')
    .trim(),
  email: z
    .string()
    .min(1, '이메일을 입력해 주세요.')
    .regex(EMAIL_REGEX, '올바른 이메일 형식이 아니에요.'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 해요.')
    .max(100, '비밀번호가 너무 길어요.'),
  passwordConfirm: z.string().min(1, '비밀번호를 다시 입력해 주세요.'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않아요.',
  path: ['passwordConfirm'],
});

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
