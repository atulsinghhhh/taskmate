import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/theme/colors';
import { TaskCardsIllustration } from '../components/TaskCardsIllustration';
import { useOnboardingStore } from '../store/onboardingStore';

// second step, opened from Welcome. Continue/Skip save the flag, then the
// root layout guard sends the user to Login.
export function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  return (
    <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
      <View className="flex-row px-5 pt-2">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))}
          accessibilityLabel="Back"
          className="h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-border bg-surface"
        >
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
      </View>
      <View className="mt-8 items-center">
        <View className="absolute top-0 h-[320px] w-[320px] rounded-full bg-primarySoft" />
        <TaskCardsIllustration />
      </View>
      <View className="flex-1" />
      <View className="items-center gap-3 px-7 pb-6">
        <Text className="text-center font-sansXBold text-[32px] leading-[38px] text-ink">
          Get things done.
        </Text>
        <Text className="mb-3 max-w-[310px] text-center font-sans text-base leading-6 text-muted">
          Organize your tasks, track deadlines, and focus on what matters.
        </Text>
        <View className="w-full">
          <AppButton label="Continue" onPress={completeOnboarding} />
        </View>
        <Pressable onPress={completeOnboarding} hitSlop={8} className="h-11 justify-center px-3">
          <Text className="font-sansBold text-[15px] text-muted">Skip</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
