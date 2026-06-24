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
import { signInSchema, type SignInFormValues } from '../utils/authValidation';

export function SignInScreen() {
  const { login } = useAuthActions();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: SignInFormValues) {
    setServerError(null);
    try {
      await login(values);
      // 성공 시 ProtectedLayout이 자동으로 홈으로 리다이렉트
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.appError.type === 'unauthorized') {
          setServerError('이메일 또는 비밀번호가 맞지 않아요.');
        } else if (err.appError.type === 'network') {
          setServerError('인터넷 연결을 확인하고 다시 시도해 주세요.');
        } else {
          setServerError('로그인 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
        }
      } else {
        setServerError('로그인 중 문제가 생겼어요.');
      }
    }
  }

  return (
    <Screen scrollable keyboardAvoiding>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>안녕하세요 👋</Text>
          <Text style={styles.subtitle}>오늘도 뭔가 해봐요</Text>
        </View>

        <View style={styles.form}>
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
                label="비밀번호"
                placeholder="비밀번호를 입력해 주세요"
                returnKeyType="done"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                onSubmitEditing={handleSubmit(onSubmit)}
                error={errors.password?.message}
              />
            )}
          />

          {serverError ? (
            <Text style={styles.serverError} accessibilityRole="alert">
              {serverError}
            </Text>
          ) : null}

          <Button
            label="로그인"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            size="lg"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>계정이 없으신가요? </Text>
          <Link href="/(public)/sign-up" asChild>
            <Text style={styles.link}>회원가입</Text>
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
