// same tokens as palette.js; prefer className, use this for icon colors etc.
import palette from './palette';

export const colors = {
  ...palette,
  // Legacy names still used by screens that haven't been restyled yet.
  textPrimary: palette.ink,
  textSecondary: palette.muted,
  textDisabled: '#B9B7C9',
  priorityLow: palette.success,
  priorityMedium: palette.warning,
  priorityHigh: palette.danger,
} as const;
