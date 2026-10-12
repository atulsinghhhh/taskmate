import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { AuthShell } from '../components/AuthShell';
import { sendPasswordReset } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { validateEmail } from '../validation';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const serverError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  // Don't carry an error from this screen over to the sign-up screen.
  useEffect(() => clearError, [clearError]);

  const handleSubmit = async () => {
    clearError();
    setResetMessage(null);

    const nextEmailError = validateEmail(email);
    const nextPasswordError = password ? null : 'Password is required.';
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextEmailError || nextPasswordError) return;

    try {
      await login(email.trim(), password);
      // On success Firebase updates the auth store and the root layout
      // swaps to the (app) group by itself; no navigation call needed.
    } catch {
      // The store already captured a friendly message in `serverError`.
    }
  };

  const handleForgotPassword = async () => {
    clearError();
    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);
    if (nextEmailError) return;

    try {
      await sendPasswordReset(email.trim());
      // Same wording whether or not the account exists, so the screen can't
      // be used to discover which emails are registered.
      setResetMessage(`If an account exists for ${email.trim()}, a reset link is on its way.`);
    } catch (error) {
      useAuthStore.setState({ error: (error as { message: string }).message });
    }
  };

  return (
    <AuthShell
      variant="login"
      // Login is the first auth screen, so back means the Welcome screen.
      onBack={() => useOnboardingStore.getState().resetOnboarding()}
      title="Welcome back!"
      subtitle="Log in to keep your tasks on track."
      footer={
        <>
          <Text className="font-sans text-[15px] text-muted">New to TaskMate? </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable hitSlop={8} className="h-11 justify-center">
              <Text className="font-sansXBold text-[15px] text-primary">Create an account</Text>
            </Pressable>
          </Link>
        </>
      }
    >
      <AppInput
        label="Email"
        icon="mail-outline"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError(null);
        }}
        error={emailError ?? undefined}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        placeholder="you@example.com"
      />
      <AppInput
        label="Password"
        icon="lock-closed-outline"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError(null);
        }}
        error={passwordError ?? undefined}
        secureToggle
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        placeholder="Enter your password"
      />

      <Pressable onPress={handleForgotPassword} hitSlop={8} className="-mt-1 mb-2 h-11 justify-center self-end">
        <Text className="font-sansBold text-sm text-primary">Forgot password?</Text>
      </Pressable>

      {serverError ? (
        <View className="mb-4 rounded-2xl bg-dangerSoft px-4 py-3">
          <Text className="font-sansSemi text-sm text-dangerInk">{serverError}</Text>
        </View>
      ) : null}
      {resetMessage ? (
        <View className="mb-4 rounded-2xl bg-successSoft px-4 py-3">
          <Text className="font-sansSemi text-sm text-successInk">{resetMessage}</Text>
        </View>
      ) : null}

      <AppButton label="Log in" onPress={handleSubmit} loading={isSubmitting} />

    </AuthShell>
  );
}
