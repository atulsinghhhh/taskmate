import { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import { router, Stack } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTasksStore } from '@/features/tasks/store/tasksStore';
import { colors } from '@/theme/colors';

export default function AppLayout() {
  const userId = useAuthStore((state) => state.user?.uid);
  const logout = useAuthStore((state) => state.logout);
  const startListening = useTasksStore((state) => state.startListening);
  const stopListening = useTasksStore((state) => state.stopListening);

  // This group is only reachable when signed in (see root _layout.tsx), so
  // `userId` is defined here. Starting the Firestore listener at this
  // layout level (rather than inside the list screen) means it keeps
  // running while navigating between the list and task/edit screens, and
  // is cleanly torn down once on logout instead of restarting per screen.
  useEffect(() => {
    if (!userId) return;
    startListening(userId);
    return () => stopListening();
  }, [userId, startListening, stopListening]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Tasks',
          headerLeft: () => (
            <Pressable onPress={() => logout()} hitSlop={8}>
              <Text style={{ color: colors.primary, fontSize: 14 }}>Log out</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => router.push('/(app)/task/new')} hitSlop={8}>
              <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '600' }}>+</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="task/new" options={{ title: 'New Task', presentation: 'modal' }} />
      <Stack.Screen name="task/[id]" options={{ title: 'Edit Task', presentation: 'modal' }} />
    </Stack>
  );
}
