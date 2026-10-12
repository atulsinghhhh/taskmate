import { useCallback, useMemo, useState } from 'react';
import { Pressable, SectionList, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SearchBar } from '@/components/SearchBar';
import { TaskSummaryCard } from '@/components/TaskSummaryCard';
import { useAuthStore } from '@/features/auth/store/authStore';
import { colors } from '@/theme/colors';
import { countActiveFilters, getVisibleTasks } from '@/utils/taskFilters';
import { groupTasksByDueDay } from '@/utils/taskGroups';
import { TaskListItem } from '../components/TaskListItem';
import { useTasksStore } from '../store/tasksStore';
import { PRIORITIES, PRIORITY_CONFIG } from '../priority';
import type { CompletionFilter, Task, TaskPriority } from '../types/task';

const STATUS_OPTIONS: { label: string; value: CompletionFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'incomplete' },
  { label: 'Completed', value: 'completed' },
];

// "Jane Doe" -> "JD"; falls back to the first two letters of the name.
function getInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function TaskListScreen() {
  const user = useAuthStore((state) => state.user);
  const tasks = useTasksStore((state) => state.tasks);
  const filters = useTasksStore((state) => state.filters);
  const searchQuery = useTasksStore((state) => state.searchQuery);
  const isLoading = useTasksStore((state) => state.isLoading);
  const setFilters = useTasksStore((state) => state.setFilters);
  const clearFilters = useTasksStore((state) => state.clearFilters);
  const setSearchQuery = useTasksStore((state) => state.setSearchQuery);
  const toggleComplete = useTasksStore((state) => state.toggleComplete);
  const deleteTask = useTasksStore((state) => state.deleteTask);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Derived data: computed from the store, never stored separately, so it
  // can't get out of sync. useMemo recomputes only when an input changes.
  const sections = useMemo(
    () => groupTasksByDueDay(getVisibleTasks(tasks, filters, searchQuery)),
    [tasks, filters, searchQuery],
  );
  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    return { total: tasks.length, completed, pending: tasks.length - completed };
  }, [tasks]);

  const activeFilterCount = countActiveFilters(filters);
  const isNarrowed = activeFilterCount > 0 || searchQuery.trim().length > 0;

  // Stable callbacks so memoized rows don't re-render needlessly.
  const handleToggle = useCallback((t: Task) => toggleComplete(t.id, !t.completed), [toggleComplete]);
  const handleEdit = useCallback((t: Task) => router.push(`/(app)/task/${t.id}`), []);
  const handleDelete = useCallback((t: Task) => setTaskToDelete(t), []);

  if (isLoading) return <LoadingScreen />;

  const name = user?.displayName?.trim() || user?.email?.split('@')[0] || 'there';
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Rendered as the list's header so the whole dashboard scrolls together.
  // It's a JSX element (not an inline component) so the search field keeps
  // focus while you type.
  const header = (
    <View className="pb-2 pt-3">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="font-sansXBold text-[26px] leading-8 text-ink">My Tasks</Text>
          <Text className="mt-0.5 font-sans text-[13px] text-muted">{today}</Text>
        </View>
        <Pressable
          onPress={() => router.navigate('/profile')}
          accessibilityLabel="Open profile"
          className="h-11 w-11 items-center justify-center rounded-full bg-primary"
        >
          <Text className="font-sansXBold text-[15px] text-white">{getInitials(name)}</Text>
        </Pressable>
      </View>

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      <View className="mb-3.5 mt-3.5 flex-row gap-2.5">
        <TaskSummaryCard label="Total" value={stats.total} tone="primary" />
        <TaskSummaryCard label="Pending" value={stats.pending} />
        <TaskSummaryCard label="Completed" value={stats.completed} />
      </View>

      {/* Segmented status control */}
      <View className="flex-row rounded-[15px] bg-[#EFEFF7] p-1">
        {STATUS_OPTIONS.map((option) => {
          const selected = filters.completion === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setFilters({ ...filters, completion: option.value })}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className={`h-9 flex-1 items-center justify-center rounded-[11px] ${
                selected ? 'bg-surface' : ''
              }`}
            >
              <Text
                className={`text-[13px] ${
                  selected ? 'font-sansXBold text-primary' : 'font-sansSemi text-muted'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Priority chips: tap to filter, tap again to clear */}
      <View className="mt-3 flex-row items-center gap-2">
        {PRIORITIES.slice()
          .reverse()
          .map((priority: TaskPriority) => {
            const config = PRIORITY_CONFIG[priority];
            const selected = filters.priority === priority;
            return (
              <Pressable
                key={priority}
                onPress={() => setFilters({ ...filters, priority: selected ? 'all' : priority })}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                className={`h-9 flex-row items-center rounded-full px-3 ${
                  selected ? `border-[1.5px] ${config.selectedClass}` : 'border-[1.5px] border-border bg-surface'
                }`}
              >
                <View style={{ backgroundColor: config.color }} className="mr-1.5 h-2 w-2 rounded-full" />
                <Text className="font-sansBold text-[13px] text-ink">{config.label}</Text>
              </Pressable>
            );
          })}
        {activeFilterCount > 0 ? (
          <Pressable onPress={clearFilters} hitSlop={8} className="ml-auto h-11 justify-center">
            <Text className="font-sansBold text-[13px] text-muted">Clear filters</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <SectionList
        sections={sections}
        keyExtractor={(task) => task.id}
        ListHeaderComponent={header}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="grow px-5 pb-28"
        renderSectionHeader={({ section }) => (
          <View className="mb-2.5 mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text
                className={`font-sansXBold text-base ${
                  section.key === 'overdue' ? 'text-dangerInk' : 'text-ink'
                }`}
              >
                {section.title}
              </Text>
              <View className="h-[22px] min-w-[22px] items-center justify-center rounded-full bg-primarySoft px-1.5">
                <Text className="font-sansXBold text-xs text-primaryInk">{section.data.length}</Text>
              </View>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <TaskListItem
            task={item}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          isNarrowed ? (
            <EmptyState
              icon="search-outline"
              title="No matching tasks"
              subtitle="Try a different search or clear your filters."
              actionLabel="Clear search & filters"
              onAction={() => {
                clearFilters();
                setSearchQuery('');
              }}
            />
          ) : (
            <EmptyState
              title="No tasks yet"
              subtitle="Add your first task and start getting things done."
              actionLabel="Add your first task"
              onAction={() => router.push('/(app)/task/new')}
            />
          )
        }
      />

      <Pressable
        onPress={() => router.push('/(app)/task/new')}
        accessibilityLabel="Add task"
        style={FAB_SHADOW}
        className="absolute bottom-6 right-5 h-[60px] w-[60px] items-center justify-center rounded-[20px] bg-primary active:bg-primaryDark"
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>

      <ConfirmDialog
        visible={taskToDelete !== null}
        title="Delete task?"
        message={`"${taskToDelete?.title ?? ''}" will be permanently deleted.`}
        confirmLabel="Delete"
        destructive
        icon="trash-outline"
        onCancel={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) deleteTask(taskToDelete.id);
          setTaskToDelete(null);
        }}
      />
    </ScreenContainer>
  );
}

const FAB_SHADOW = {
  shadowColor: colors.primary,
  shadowOpacity: 0.4,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 10 },
  elevation: 6,
};
