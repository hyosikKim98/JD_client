import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../theme/tokens';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View style={styles.container} accessibilityLabel={message ?? '불러오는 중'} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={tokens.color.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.xl,
  },
  message: {
    fontSize: tokens.fontSize.md,
    color: tokens.color.textSecondary,
    textAlign: 'center',
  },
});
