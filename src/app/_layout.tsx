import '../../global.css';
import { Stack } from 'expo-router';
import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const user = useAuthStore((state) => state.user);
  const isAuthInitializing = useAuthStore((state) => state.isInitializing);
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const isOnboardingLoading = useOnboardingStore((state) => state.isLoading);

  return (
    <SafeAreaProvider>
      {isAuthInitializing || isOnboardingLoading || !(fontsLoaded || fontError) ? (
        // still restoring session / onboarding flag / fonts, avoids flashing the wrong screen
        <LoadingScreen />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          {/* Stack.Protected hides/shows a whole group based on `guard`,
              and redirects automatically if the underlying state changes
              while the user is on a screen in another group. Onboarding is
              purely a first-launch gate in front of the auth flow — it never
              substitutes for the auth check below, so an unauthenticated
              user can never reach (app) just because onboarding is done. */}
          <Stack.Protected guard={!hasCompletedOnboarding}>
            {/* welcome is listed first so it is the initial screen */}
            <Stack.Screen name="welcome" />
            <Stack.Screen name="onboarding" />
          </Stack.Protected>

          <Stack.Protected guard={hasCompletedOnboarding && Boolean(user)}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>

          <Stack.Protected guard={hasCompletedOnboarding && !user}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
      )}
    </SafeAreaProvider>
  );
}
