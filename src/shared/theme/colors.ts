// 브랜드 색상 — 확정 전 임시 값. 제품 결정 후 교체 필요.
// 압박·경쟁을 연상시키는 붉은 계열 사용 최소화
export const palette = {
  // Primary — 따뜻한 인디고
  primary50: '#EEF2FF',
  primary100: '#E0E7FF',
  primary200: '#C7D2FE',
  primary300: '#A5B4FC',
  primary400: '#818CF8',
  primary500: '#6366F1',
  primary600: '#4F46E5',
  primary700: '#4338CA',
  primary800: '#3730A3',
  primary900: '#312E81',

  // Neutral
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic — 중립적 피드백 (붉은 경고 최소화)
  successLight: '#ECFDF5',
  success: '#10B981',
  successDark: '#065F46',

  warningLight: '#FFFBEB',
  warning: '#F59E0B',
  warningDark: '#92400E',

  // 오류는 중립 안내용으로만 사용, 죄책감 유발 금지
  errorLight: '#FEF2F2',
  error: '#EF4444',
  errorDark: '#991B1B',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type PaletteKey = keyof typeof palette;
