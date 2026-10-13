import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { Logo } from '@/components/Logo';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TaskCardsIllustration } from '../components/TaskCardsIllustration';
import { useOnboardingStore } from '../store/onboardingStore';

// first screen a new user sees; only reachable until onboarding is completed
export function WelcomeScreen() {
  const router = useRouter();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  return (
    <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
      <View pointerEvents="none" className="absolute -left-[70px] -right-[70px] -top-20 h-[460px] rounded-b-[130px] bg-[#ECE9FF]" />
      <View className="mt-12 items-center">
        <TaskCardsIllustration large />
      </View>
      <View className="flex-1" />
      <View className="items-center gap-3 px-7 pb-6">
        <View className="flex-row items-center gap-2.5">
          <Logo size={36} />
          <Text className="font-sansXBold text-[22px] text-primary">TaskMate</Text>
        </View>
        <Text className="mt-1.5 text-center font-sansXBold text-[34px] leading-10 text-ink">
          Your day, organized.
        </Text>
        <Text className="mb-3 max-w-[300px] text-center font-sans text-base leading-6 text-muted">
          One simple place to plan your work and stay on track.
        </Text>
        <View className="w-full">
          <AppButton label="Get Started" onPress={() => router.push('/onboarding')} />
        </View>
        {/* skips the pitch: marks onboarding done, and the root layout guard moves us to Login */}
        <Pressable onPress={completeOnboarding} hitSlop={8} className="h-11 justify-center px-3">
          <Text className="font-sansBold text-[15px] text-primary">I already have an account</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
