import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { colors } from '@/theme/colors';
import { parseDateInput, toDateInputValue } from '@/utils/formatDate';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTasksStore } from '../store/tasksStore';
import type { TaskPriority } from '../types/task';

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

interface TaskFormScreenProps {
  taskId?: string;
}

// Shared by both the "new task" and "edit task" routes — when `taskId` is
// given we look that task up in the store and prefill the form; otherwise
// it starts blank. This avoids duplicating the form UI in two places.
export function TaskFormScreen({ taskId }: TaskFormScreenProps) {
  const existingTask = useTasksStore((state) => state.tasks.find((task) => task.id === taskId));
  const createTask = useTasksStore((state) => state.createTask);
  const updateTask = useTasksStore((state) => state.updateTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);
  const userId = useAuthStore((state) => state.user?.uid);

  const [title, setTitle] = useState(existingTask?.title ?? '');
  const [description, setDescription] = useState(existingTask?.description ?? '');
  const [dueDateText, setDueDateText] = useState(toDateInputValue(existingTask?.dueDate ?? null));
  const [priority, setPriority] = useState<TaskPriority>(existingTask?.priority ?? 'medium');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(existingTask);

  const handleSubmit = async () => {
    setError(null);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    let dueDate: Date | null = null;
    if (dueDateText.trim()) {
      dueDate = parseDateInput(dueDateText);
      if (!dueDate) {
        setError('Due date must be in YYYY-MM-DD format, e.g. 2026-10-31.');
        return;
      }
    }

    if (!userId) return;

    setIsSubmitting(true);
    try {
      const input = { title: title.trim(), description: description.trim(), dueDate, priority };
      if (existingTask) {
        await updateTask(existingTask.id, input);
      } else {
        await createTask(userId, input);
      }
      router.back();
    } catch {
      setError('Could not save task. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!existingTask) return;
    Alert.alert('Delete task?', `"${existingTask.title}" will be permanently deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(existingTask.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <TextField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Deliver groceries"
        />
        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Optional details"
          multiline
          numberOfLines={3}
          style={styles.multiline}
        />
        <TextField
          label="Due date"
          value={dueDateText}
          onChangeText={setDueDateText}
          placeholder="YYYY-MM-DD (optional)"
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((value) => (
            <Pressable
              key={value}
              onPress={() => setPriority(value)}
              style={[styles.priorityOption, priority === value && styles.priorityOptionSelected]}
            >
              <Text
                style={[styles.priorityText, priority === value && styles.priorityTextSelected]}
              >
                {value[0].toUpperCase() + value.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        <Button
          label={isEditing ? 'Save Changes' : 'Create Task'}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!title.trim()}
        />

        {isEditing ? (
          <View style={styles.deleteButtonWrapper}>
            <Button label="Delete Task" variant="secondary" onPress={handleDelete} />
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    padding: 20,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  priorityOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  priorityTextSelected: {
    color: '#fff',
  },
  errorBanner: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 16,
  },
  deleteButtonWrapper: {
    marginTop: 12,
  },
});
