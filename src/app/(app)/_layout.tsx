import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTasksStore } from '@/features/tasks/store/tasksStore';

export default function AppLayout() {
  const userId = useAuthStore((state) => state.user?.uid);
  const startListening = useTasksStore((state) => state.startListening);
  const stopListening = useTasksStore((state) => state.stopListening);

  // listener lives here so it survives tab switches; stops on logout
  useEffect(() => {
    if (!userId) return;
    startListening(userId);
    return () => stopListening();
  }, [userId, startListening, stopListening]);

  return (
    <Stack>
      {/* The tab bar (Tasks / Profile) lives in (tabs)/_layout.tsx. Nesting
          it under this Stack means task/new and task/[id] can be pushed as
          modals on top of it without the tab bar showing through. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="task/new" options={{ title: 'New Task', presentation: 'modal' }} />
      <Stack.Screen name="task/[id]" options={{ title: 'Edit Task', presentation: 'modal' }} />
    </Stack>
  );
}
