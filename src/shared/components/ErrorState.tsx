import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../theme/tokens';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = '문제가 발생했어요',
  description = '잠시 후 다시 시도해 주세요.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onRetry ? (
        <Button label="다시 시도" onPress={onRetry} variant="secondary" style={styles.retry} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xl,
    gap: tokens.spacing.sm,
  },
  title: {
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.color.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: tokens.fontSize.md,
    color: tokens.color.textSecondary,
    textAlign: 'center',
    lineHeight: tokens.fontSize.md * tokens.lineHeight.normal,
  },
  retry: {
    marginTop: tokens.spacing.md,
  },
});
