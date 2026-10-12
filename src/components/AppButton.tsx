import { ActivityIndicator, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerSoft';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  // Compact outlined button (e.g. "Edit profile") instead of full width.
  compact?: boolean;
}

// Button used for every action. `variant` picks the look:
//   primary     solid purple (main action)
//   secondary   white with purple outline (Cancel, Edit profile)
//   ghost       text only (Skip, Cancel under a primary button)
//   danger      solid red (confirm a destructive action)
//   dangerSoft  pale red with red text (Log out, Delete task)
const CONTAINER: Record<Variant, string> = {
  primary: 'bg-primary active:bg-primaryDark',
  secondary: 'border-[1.5px] border-primary bg-surface active:bg-primarySoft',
  ghost: 'bg-transparent active:bg-primarySoft',
  danger: 'bg-dangerStrong active:opacity-80',
  dangerSoft: 'border-[1.5px] border-dangerBorder bg-dangerWash active:opacity-80',
};
const TEXT: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-primary',
  ghost: 'text-primary',
  danger: 'text-white',
  dangerSoft: 'text-dangerInk',
};
const ICON: Record<Variant, string> = {
  primary: '#FFFFFF',
  secondary: colors.primary,
  ghost: colors.primary,
  danger: '#FFFFFF',
  dangerSoft: colors.dangerInk,
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  compact = false,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={variant === 'primary' && !isDisabled ? SHADOW : undefined}
      className={`flex-row items-center justify-center rounded-2xl px-4 ${
        compact ? 'h-11 self-center px-5' : variant === 'ghost' ? 'h-11' : 'h-[54px]'
      } ${CONTAINER[variant]} ${isDisabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : colors.primary} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={ICON[variant]} style={{ marginRight: 8 }} /> : null}
          <Text className={`font-sansBold ${compact ? 'text-sm' : 'text-base'} ${TEXT[variant]}`}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const SHADOW = {
  shadowColor: colors.primary,
  shadowOpacity: 0.28,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
};
