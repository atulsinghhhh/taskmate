import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { AuthShell } from '../components/AuthShell';
import { useAuthStore } from '../store/authStore';
import { validateConfirmPassword, validateEmail, validateNewPassword } from '../validation';

export function RegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // One object for all field errors keeps the three useState calls from
  // multiplying; each key is the field's name.
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});

  const register = useAuthStore((state) => state.register);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const serverError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  useEffect(() => clearError, [clearError]);

  const clearFieldError = (field: keyof typeof errors) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  const handleSubmit = async () => {
    clearError();

    const nextErrors = {
      name: displayName.trim() ? undefined : 'Please enter your name.',
      email: validateEmail(email) ?? undefined,
      password: validateNewPassword(password) ?? undefined,
      confirm: validateConfirmPassword(password, confirmPassword) ?? undefined,
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email || nextErrors.password || nextErrors.confirm) return;

    try {
      await register(email.trim(), password, displayName.trim());
      // Firebase signs the new user in automatically. Make sure onboarding
      // is marked done (never shown after signing up) and go to the main screen.
      await useOnboardingStore.getState().completeOnboarding();
      router.replace('/');
    } catch {
      // `serverError` now holds e.g. "An account with this email already exists."
    }
  };

  return (
    <AuthShell
      variant="register"
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/(auth)/login'))}
      title="Let’s get started!"
      subtitle="Create an account to organize your tasks."
      footer={
        <>
          <Text className="font-sans text-[15px] text-muted">Already have an account? </Text>
          <Link href="/(auth)/login" replace asChild>
            <Pressable hitSlop={8} className="h-11 justify-center">
              <Text className="font-sansXBold text-[15px] text-primary">Log in</Text>
            </Pressable>
          </Link>
        </>
      }
    >
      <AppInput
        label="Display name"
        icon="person-outline"
        value={displayName}
        onChangeText={(text) => {
          setDisplayName(text);
          clearFieldError('name');
        }}
        error={errors.name}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        placeholder="Your name"
      />
      <AppInput
        label="Email"
        icon="mail-outline"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clearFieldError('email');
        }}
        error={errors.email}
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
          clearFieldError('password');
        }}
        error={errors.password}
        secureToggle
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        placeholder="Create a password"
        hint="At least 6 characters"
      />
      <AppInput
        label="Confirm password"
        icon="lock-closed-outline"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          clearFieldError('confirm');
        }}
        error={errors.confirm}
        secureToggle
        autoCapitalize="none"
        autoComplete="new-password"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        placeholder="Re-enter your password"
      />

      {serverError ? (
        <View className="mb-4 rounded-2xl bg-dangerSoft px-4 py-3">
          <Text className="font-sansSemi text-sm text-dangerInk">{serverError}</Text>
        </View>
      ) : null}

      <AppButton label="Create account" onPress={handleSubmit} loading={isSubmitting} />

    </AuthShell>
  );
}
