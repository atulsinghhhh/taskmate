import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { LoadingScreen } from '@/components/LoadingScreen';
import { colors } from '@/theme/colors';
import { getVisibleTasks } from '@/utils/taskFilters';
import { FilterBar } from '../components/FilterBar';
import { TaskListItem } from '../components/TaskListItem';
import { useTasksStore } from '../store/tasksStore';

export function TaskListScreen() {
  const tasks = useTasksStore((state) => state.tasks);
  const filters = useTasksStore((state) => state.filters);
  const isLoading = useTasksStore((state) => state.isLoading);

  // Recomputed only when the task list or filters actually change, not on
  // every render (e.g. when an unrelated store field updates).
  const visibleTasks = useMemo(() => getVisibleTasks(tasks, filters), [tasks, filters]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <FilterBar />
      {visibleTasks.length === 0 ? (
        <EmptyState
          title={tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
          subtitle={
            tasks.length === 0
              ? 'Tap the + button above to create your first task.'
              : 'Try clearing filters to see more tasks.'
          }
        />
      ) : (
        <FlatList
          data={visibleTasks}
          keyExtractor={(task) => task.id}
          renderItem={({ item }) => <TaskListItem task={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
