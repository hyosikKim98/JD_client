import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { tokens } from '../theme/tokens';

interface PasswordFieldProps extends Omit<TextInputProps, 'style' | 'secureTextEntry'> {
  label: string;
  error?: string | undefined;
}

export function PasswordField({ label, error, ...rest }: PasswordFieldProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, focused && styles.inputRowFocused, !!error && styles.inputRowError]}>
        <TextInput
          style={styles.input}
          secureTextEntry={!visible}
          placeholderTextColor={tokens.color.textDisabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          // OS 자동완성 비밀번호 지원
          textContentType="password"
          autoComplete="password"
          importantForAutofill="yes"
          {...rest}
        />
        <Pressable
          onPress={() => setVisible((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
          style={styles.toggle}
          hitSlop={8}
        >
          <Text style={styles.toggleText}>{visible ? '숨기기' : '표시'}</Text>
        </Pressable>
      </View>
      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.xs,
  },
  label: {
    fontSize: tokens.fontSize.sm,
    fontWeight: tokens.fontWeight.medium,
    color: tokens.color.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.bgInput,
    paddingHorizontal: tokens.spacing.md,
  },
  inputRowFocused: {
    borderColor: tokens.color.borderFocus,
    borderWidth: 1.5,
  },
  inputRowError: {
    borderColor: tokens.color.error,
  },
  input: {
    flex: 1,
    fontSize: tokens.fontSize.md,
    color: tokens.color.textPrimary,
    height: '100%',
  },
  toggle: {
    paddingVertical: tokens.spacing.xs,
    paddingLeft: tokens.spacing.sm,
    minWidth: tokens.minTouchTarget,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: tokens.fontSize.sm,
    color: tokens.color.primary,
    fontWeight: tokens.fontWeight.medium,
  },
  errorText: {
    fontSize: tokens.fontSize.xs,
    color: tokens.color.error,
  },
});
