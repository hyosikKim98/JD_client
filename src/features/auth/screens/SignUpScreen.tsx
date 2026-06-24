import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { ApiError } from '@/shared/api/errors';
import { Button } from '@/shared/components/Button';
import { PasswordField } from '@/shared/components/PasswordField';
import { Screen } from '@/shared/components/Screen';
import { TextField } from '@/shared/components/TextField';
import { tokens } from '@/shared/theme/tokens';
import { useAuthActions } from '../hooks/useAuth';
import { signUpSchema, type SignUpFormValues } from '../utils/authValidation';

export function SignUpScreen() {
  const { signUp } = useAuthActions();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', passwordConfirm: '' },
  });

  async function onSubmit(values: SignUpFormValues) {
    setServerError(null);
    try {
      await signUp({ name: values.name, email: values.email, password: values.password });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.appError.type === 'conflict') {
          setServerError('이미 사용 중인 이메일이에요.');
        } else if (err.appError.type === 'network') {
          setServerError('인터넷 연결을 확인하고 다시 시도해 주세요.');
        } else if (err.appError.type === 'validation' && err.appError.fields) {
          setServerError(Object.values(err.appError.fields)[0] ?? '입력한 내용을 확인해 주세요.');
        } else {
          setServerError('회원가입 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
        }
      } else {
        setServerError('회원가입 중 문제가 생겼어요.');
      }
    }
  }

  return (
    <Screen scrollable keyboardAvoiding>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>같이 해봐요 ✨</Text>
          <Text style={styles.subtitle}>이름과 이메일로 시작해요</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="이름"
                placeholder="이름을 입력해 주세요"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="이메일"
                placeholder="이메일을 입력해 주세요"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordField
                label="비밀번호 (8자 이상)"
                placeholder="비밀번호를 입력해 주세요"
                textContentType="newPassword"
                autoComplete="new-password"
                returnKeyType="next"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordField
                label="비밀번호 확인"
                placeholder="비밀번호를 다시 입력해 주세요"
                textContentType="newPassword"
                autoComplete="new-password"
                returnKeyType="done"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                onSubmitEditing={handleSubmit(onSubmit)}
                error={errors.passwordConfirm?.message}
              />
            )}
          />

          {serverError ? (
            <Text style={styles.serverError} accessibilityRole="alert">
              {serverError}
            </Text>
          ) : null}

          <Button
            label="회원가입"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            size="lg"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>이미 계정이 있으신가요? </Text>
          <Link href="/(public)/sign-in" asChild>
            <Text style={styles.link}>로그인</Text>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.xxl,
    gap: tokens.spacing.xl,
  },
  header: {
    gap: tokens.spacing.xs,
  },
  title: {
    fontSize: tokens.fontSize.xxl,
    fontWeight: tokens.fontWeight.bold,
    color: tokens.color.textPrimary,
  },
  subtitle: {
    fontSize: tokens.fontSize.md,
    color: tokens.color.textSecondary,
  },
  form: {
    gap: tokens.spacing.md,
  },
  serverError: {
    fontSize: tokens.fontSize.sm,
    color: tokens.color.error,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: tokens.spacing.lg,
  },
  footerText: {
    fontSize: tokens.fontSize.sm,
    color: tokens.color.textSecondary,
  },
  link: {
    fontSize: tokens.fontSize.sm,
    color: tokens.color.primary,
    fontWeight: tokens.fontWeight.semibold,
  },
});
