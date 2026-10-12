import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: keyof typeof Ionicons.glyphMap;
  // Provide both to show a call-to-action button.
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  subtitle,
  icon = 'checkbox-outline',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 pt-10">
      <View className="mb-4 h-32 w-32 items-center justify-center rounded-full bg-primarySoft">
        <View className="h-16 w-16 items-center justify-center rounded-[20px] bg-primary">
          <Ionicons name={icon} size={32} color="#FFFFFF" />
        </View>
      </View>
      <Text className="mb-1.5 text-center font-sansXBold text-[22px] text-ink">{title}</Text>
      <Text className="mb-6 max-w-[270px] text-center font-sans text-[15px] leading-[22px] text-muted">
        {subtitle}
      </Text>
      {actionLabel && onAction ? (
        <View className="w-full max-w-[260px]">
          <AppButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
