import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/AppButton';
import { Logo } from '@/components/Logo';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/theme/colors';
import { useOnboardingStore } from '../store/onboardingStore';

// Shown once, on first launch, before the auth flow. See the root layout
// (src/app/_layout.tsx) for how `hasCompletedOnboarding` decides whether
// this screen or the (auth)/(app) groups are reachable.
//
// Two steps: Welcome, then a short "Get things done" pitch. Finishing or
// skipping either one completes onboarding.
export function OnboardingScreen() {
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const [step, setStep] = useState<'welcome' | 'pitch'>('welcome');

  if (step === 'welcome') {
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
            <AppButton label="Get Started" onPress={() => setStep('pitch')} />
          </View>
          <Pressable onPress={completeOnboarding} hitSlop={8} className="h-11 justify-center px-3">
            <Text className="font-sansBold text-[15px] text-primary">I already have an account</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
      <View className="flex-row px-5 pt-2">
        <Pressable
          onPress={() => setStep('welcome')}
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

// A few stacked task cards, built from plain Views (no SVG dependency).
function TaskCardsIllustration({ large = false }: { large?: boolean }) {
  const rows = [
    { done: true, badge: 'bg-dangerSoft', offset: 'self-start' },
    { done: false, badge: 'bg-warningSoft', offset: 'self-end' },
    { done: false, badge: 'bg-successSoft', offset: 'self-start ml-2' },
  ];
  return (
    <View className={`w-[290px] gap-4 ${large ? 'py-6' : 'py-3'}`}>
      {rows.map((row, i) => (
        <View
          key={i}
          style={CARD_SHADOW}
          className={`h-[72px] w-[236px] flex-row items-center rounded-[22px] bg-surface px-4 ${row.offset}`}
        >
          <View
            className={`h-7 w-7 items-center justify-center rounded-full ${
              row.done ? 'bg-success' : 'border-2 border-subtle'
            }`}
          >
            {row.done ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
          </View>
          <View className="ml-3 flex-1 gap-2">
            <View className="h-2.5 w-24 rounded-full bg-[#D9D5FF]" />
            <View className="h-2 w-16 rounded-full bg-[#EFEDFF]" />
          </View>
          <View className={`h-5 w-11 rounded-full ${row.badge}`} />
        </View>
      ))}
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: '#6558F5',
  shadowOpacity: 0.16,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 3,
};
