// Single source of truth for colors so screens stay visually consistent.
// Material Design-inspired: one primary brand color, semantic colors for
// priority/status, and neutral grays for text/backgrounds/borders.
export const colors = {
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',

  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textDisabled: '#94A3B8',

  success: '#16A34A',
  danger: '#DC2626',
  warning: '#D97706',

  priorityLow: '#16A34A',
  priorityMedium: '#D97706',
  priorityHigh: '#DC2626',
} as const;
