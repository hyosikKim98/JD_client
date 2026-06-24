import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import { tokens } from '../theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <View style={styles.row}>
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? tokens.color.textInverse : tokens.color.primary}
          />
          <Text style={[styles.label, styles[`label_${variant}`], styles[`label_${size}`], styles.labelWithSpinner]}>
            {label}
          </Text>
        </View>
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`label_${size}`]]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: tokens.minTouchTarget,
  },
  fullWidth: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },

  // Variants
  primary: {
    backgroundColor: tokens.color.primary,
  },
  secondary: {
    backgroundColor: tokens.color.primaryLight,
    borderWidth: 1,
    borderColor: tokens.color.primary,
  },
  ghost: {
    backgroundColor: 'transparent' as const,
  },

  // Sizes
  sm: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    minHeight: tokens.minTouchTarget,
  },
  md: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm + 2,
    minHeight: tokens.minTouchTarget,
  },
  lg: {
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.md,
    minHeight: 52,
  },

  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },

  // Labels
  label: {
    fontWeight: tokens.fontWeight.semibold,
  },
  label_primary: {
    color: tokens.color.textInverse,
  },
  label_secondary: {
    color: tokens.color.primary,
  },
  label_ghost: {
    color: tokens.color.primary,
  },
  label_sm: {
    fontSize: tokens.fontSize.sm,
  },
  label_md: {
    fontSize: tokens.fontSize.md,
  },
  label_lg: {
    fontSize: tokens.fontSize.lg,
  },
  labelWithSpinner: {
    marginLeft: 0,
  },
});
