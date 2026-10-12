import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TaskSummaryCard } from '@/components/TaskSummaryCard';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTasksStore } from '@/features/tasks/store/tasksStore';
import { colors } from '@/theme/colors';
import { Avatar } from '../components/Avatar';

function formatMemberSince(createdAt: string | null): string {
  if (!createdAt) return '—';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Reads the same store the Tasks tab listens to — no second Firestore
  // subscription is started here (see (app)/_layout.tsx for the listener).
  const tasks = useTasksStore((state) => state.tasks);

  const [isLogoutConfirmVisible, setIsLogoutConfirmVisible] = useState(false);

  const summary = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return { total: tasks.length, completed, pending: tasks.length - completed };
  }, [tasks]);

  if (!user) {
    // Unreachable in practice: this route only renders inside the (app)
    // group, which Stack.Protected in the root layout already guards on
    // `Boolean(user)`. Kept as a safe fallback rather than assuming.
    return <ScreenContainer>{null}</ScreenContainer>;
  }

  const rows: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[] = [
    { icon: 'person-outline', label: 'Display name', value: user.displayName?.trim() || 'Not set' },
    { icon: 'mail-outline', label: 'Email', value: user.email ?? '—' },
    { icon: 'calendar-outline', label: 'Member since', value: formatMemberSince(user.createdAt) },
  ];

  return (
    <ScreenContainer scroll className="pt-3">
      <View className="items-center">
        <Text className="mb-2.5 self-start font-sansXBold text-[26px] leading-8 text-ink">Profile</Text>
        <Avatar displayName={user.displayName} email={user.email} size={88} />
        <Text className="mt-3 font-sansXBold text-[22px] text-ink">
          {user.displayName?.trim() || 'Add your name'}
        </Text>
        <Text className="mt-0.5 font-sans text-sm text-muted">{user.email}</Text>
        <View className="mt-3">
          <AppButton
            label="Edit profile"
            variant="secondary"
            icon="create-outline"
            compact
            onPress={() => router.push('/(app)/edit-profile')}
          />
        </View>
      </View>

      <Text className="mb-2 mt-5 font-sansXBold text-sm text-ink">Account information</Text>
      <View style={CARD_SHADOW} className="rounded-[18px] border border-cardBorder bg-surface">
        {rows.map((row, i) => (
          <View
            key={row.label}
            className={`h-14 flex-row items-center px-3.5 ${
              i < rows.length - 1 ? 'border-b border-cardBorder' : ''
            }`}
          >
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-xl bg-primarySoft">
              <Ionicons name={row.icon} size={18} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="font-sansSemi text-xs text-muted">{row.label}</Text>
              <Text numberOfLines={1} className="font-sansBold text-[15px] text-ink">
                {row.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text className="mb-2 mt-4 font-sansXBold text-sm text-ink">Task statistics</Text>
      <View className="flex-row gap-2.5">
        <TaskSummaryCard label="Total" value={summary.total} valueClass="text-primary" />
        <TaskSummaryCard label="Completed" value={summary.completed} valueClass="text-successInk" />
        <TaskSummaryCard label="Pending" value={summary.pending} valueClass="text-warningInk" />
      </View>

      <View className="mt-8">
        <AppButton
          label="Log out"
          variant="dangerSoft"
          icon="log-out-outline"
          onPress={() => setIsLogoutConfirmVisible(true)}
        />
      </View>

      <ConfirmDialog
        visible={isLogoutConfirmVisible}
        title="Log out?"
        message="Are you sure you want to log out?"
        confirmLabel="Log out"
        destructive
        icon="log-out-outline"
        onCancel={() => setIsLogoutConfirmVisible(false)}
        onConfirm={() => {
          setIsLogoutConfirmVisible(false);
          logout();
        }}
      />
    </ScreenContainer>
  );
}

const CARD_SHADOW = {
  shadowColor: colors.ink,
  shadowOpacity: 0.06,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
};
