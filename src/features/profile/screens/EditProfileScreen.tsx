import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Avatar } from '../components/Avatar';

export function EditProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const updateDisplayName = useAuthStore((state) => state.updateDisplayName);

  const [name, setName] = useState(user?.displayName ?? '');
  const [error, setError] = useState<string | null>(null);

  if (!user) return <ScreenContainer>{null}</ScreenContainer>;

  const handleSave = async () => {
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name cannot be empty.');
      return;
    }
    try {
      await updateDisplayName(trimmed);
      router.back();
    } catch {
      setError('Could not update your name. Check your connection and try again.');
    }
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom', 'left', 'right']}>
      <ScreenHeader title="Edit profile" />

      <View className="items-center gap-2.5 pb-6 pt-3">
        <Avatar displayName={name} email={user.email} size={96} />
        <Text className="max-w-[240px] text-center font-sans text-[13px] text-muted">
          Your initials are created from your display name.
        </Text>
      </View>

      <AppInput
        label="Display name"
        icon="person-outline"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError(null);
        }}
        error={error ?? undefined}
        placeholder="Your name"
        autoCapitalize="words"
      />
      <AppInput
        label="Email"
        icon="mail-outline"
        value={user.email ?? ''}
        editable={false}
        hint="Email can’t be changed here."
      />

      <View className="flex-1" />
      <View className="mt-6 gap-2.5">
        <AppButton label="Save changes" onPress={handleSave} loading={isSubmitting} />
        <AppButton label="Cancel" variant="ghost" onPress={() => router.back()} disabled={isSubmitting} />
      </View>
    </ScreenContainer>
  );
}
