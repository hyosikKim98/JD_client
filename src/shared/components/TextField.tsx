import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { tokens } from '../theme/tokens';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
}

export function TextField({ label, error, hint, ...rest }: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
        placeholderTextColor={tokens.color.textDisabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        accessibilityHint={hint ?? undefined}
        {...rest}
      />
      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: tokens.color.bgInput,
    fontSize: tokens.fontSize.md,
    color: tokens.color.textPrimary,
  },
  inputFocused: {
    borderColor: tokens.color.borderFocus,
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: tokens.color.error,
  },
  errorText: {
    fontSize: tokens.fontSize.xs,
    color: tokens.color.error,
  },
  hintText: {
    fontSize: tokens.fontSize.xs,
    color: tokens.color.textDisabled,
  },
});
