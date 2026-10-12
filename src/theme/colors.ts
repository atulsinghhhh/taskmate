// Same tokens as tailwind.config.js (see palette.js). Use className
// (bg-primary, text-ink...) for styling; use this object only where a
// className can't go, such as icon `color` props and ActivityIndicator.
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
