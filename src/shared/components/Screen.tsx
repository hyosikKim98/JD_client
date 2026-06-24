import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens } from '../theme/tokens';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  safeArea?: boolean;
}

export function Screen({
  children,
  scrollable = false,
  keyboardAvoiding = false,
  safeArea = true,
  style,
  ...rest
}: ScreenProps) {
  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, style]} {...rest}>
      {children}
    </View>
  );

  const wrapped = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {content}
    </KeyboardAvoidingView>
  ) : content;

  if (safeArea) {
    return (
      <SafeAreaView style={[styles.safeArea, !scrollable && style]} edges={['top', 'left', 'right']}>
        {wrapped}
      </SafeAreaView>
    );
  }

  return <View style={[styles.flex, !scrollable && style]}>{wrapped}</View>;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: tokens.color.bgPage,
  },
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bgPage,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
});
