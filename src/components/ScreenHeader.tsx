import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';

interface ScreenHeaderProps {
  title: string;
}

// Round back button + centered title for pushed screens (task form, edit
// profile). The right-hand spacer is the same width as the button, so the
// title stays truly centered.
export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View className="mb-5 h-14 flex-row items-center justify-between">
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        accessibilityLabel="Go back"
        className="h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-border bg-surface"
      >
        <Ionicons name="chevron-back" size={22} color={colors.ink} />
      </Pressable>
      <Text className="font-sansXBold text-lg text-ink">{title}</Text>
      <View className="h-11 w-11" />
    </View>
  );
}
