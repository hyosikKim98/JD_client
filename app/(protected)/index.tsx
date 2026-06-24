import { StyleSheet, Text, View } from 'react-native';
import { useAuthActions } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { Button } from '@/shared/components/Button';
import { Screen } from '@/shared/components/Screen';
import { tokens } from '@/shared/theme/tokens';

// Stage 0 완료 기준: 로그인 후 빈 홈에 진입 확인용 placeholder
// Stage 1에서 개인 달력으로 교체
export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuthActions();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.greeting}>{user?.name ?? ''}님, 안녕하세요 👋</Text>
        <Text style={styles.subtext}>개인 달력은 곧 여기에 나타나요.</Text>

        <Button label="로그아웃" variant="ghost" onPress={logout} style={styles.logout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xl,
    gap: tokens.spacing.md,
  },
  greeting: {
    fontSize: tokens.fontSize.xl,
    fontWeight: tokens.fontWeight.bold,
    color: tokens.color.textPrimary,
    textAlign: 'center',
  },
  subtext: {
    fontSize: tokens.fontSize.md,
    color: tokens.color.textSecondary,
    textAlign: 'center',
  },
  logout: {
    marginTop: tokens.spacing.lg,
  },
});
