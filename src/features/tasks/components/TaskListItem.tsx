import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { formatDueDate, isOverdue } from '@/utils/formatDate';
import { useTasksStore } from '../store/tasksStore';
import type { Task } from '../types/task';
import { PriorityBadge } from './PriorityBadge';

export function TaskListItem({ task }: { task: Task }) {
  const toggleComplete = useTasksStore((state) => state.toggleComplete);
  const deleteTask = useTasksStore((state) => state.deleteTask);

  const overdue = isOverdue(task.dueDate, task.completed);

  const confirmDelete = () => {
    Alert.alert('Delete task?', `"${task.title}" will be permanently deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  };

  return (
    <Pressable
      style={styles.row}
      onPress={() => router.push(`/(app)/task/${task.id}`)}
    >
      <Pressable
        hitSlop={8}
        onPress={() => toggleComplete(task.id, !task.completed)}
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
      >
        {task.completed ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.titleCompleted]} numberOfLines={1}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <PriorityBadge priority={task.priority} />
          <Text style={[styles.dueDate, overdue && styles.dueDateOverdue]}>
            {formatDueDate(task.dueDate)}
          </Text>
        </View>
      </View>

      <Pressable hitSlop={8} onPress={confirmDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textDisabled,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  dueDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dueDateOverdue: {
    color: colors.danger,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  deleteText: {
    fontSize: 16,
    color: colors.textDisabled,
  },
});
