import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/theme/colors';

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
