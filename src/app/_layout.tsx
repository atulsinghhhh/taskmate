import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function RootLayout() {
  const user = useAuthStore((state) => state.user);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  return (
    <SafeAreaProvider>
      {isInitializing ? (
        // Firebase is still checking AsyncStorage for a saved session.
        // Showing nothing but a spinner here (instead of the login screen)
        // avoids a flash of the login screen for users who are actually
        // already logged in.
        <LoadingScreen />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          {/* Stack.Protected hides/shows a whole group based on `guard`,
              and redirects automatically if the user's auth state changes
              while they're on a screen in the other group. */}
          <Stack.Protected guard={Boolean(user)}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>

          <Stack.Protected guard={!user}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
      )}
    </SafeAreaProvider>
  );
}
