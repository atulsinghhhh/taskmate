import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTasksStore } from '@/features/tasks/store/tasksStore';

export default function AppLayout() {
  const userId = useAuthStore((state) => state.user?.uid);
  const startListening = useTasksStore((state) => state.startListening);
  const stopListening = useTasksStore((state) => state.stopListening);

  // This group is only reachable when signed in (see root _layout.tsx), so
  // `userId` is defined here. Starting the Firestore listener at this
  // layout level (rather than inside the list screen) means it keeps
  // running while navigating between the tabs and the task/edit screens,
  // and is cleanly torn down once on logout instead of restarting per
  // screen. Logging out itself happens from the Profile tab.
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
