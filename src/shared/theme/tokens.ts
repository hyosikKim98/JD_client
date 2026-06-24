import { palette } from './colors';

export const tokens = {
  color: {
    // 브랜드
    primary: palette.primary500,
    primaryLight: palette.primary100,
    primaryDark: palette.primary700,

    // 텍스트
    textPrimary: palette.gray900,
    textSecondary: palette.gray600,
    textDisabled: palette.gray400,
    textInverse: palette.white,

    // 배경
    bgPage: palette.gray50,
    bgCard: palette.white,
    bgInput: palette.white,
    bgDisabled: palette.gray100,

    // 경계
    border: palette.gray200,
    borderFocus: palette.primary500,

    // 시맨틱
    success: palette.success,
    successBg: palette.successLight,
    warning: palette.warning,
    warningBg: palette.warningLight,
    error: palette.error,
    errorBg: palette.errorLight,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radius: {
    sm: 6,
    md: 12,
    lg: 16,
    full: 9999,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // 최소 터치 영역 44×44pt
  minTouchTarget: 44,

  shadow: {
    sm: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
  },
} as const;

export type Tokens = typeof tokens;
