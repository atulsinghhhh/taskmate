import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DateField } from '@/components/DateField';
import { EmptyState } from '@/components/EmptyState';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/features/auth/store/authStore';
import { PrioritySelector } from '../components/PrioritySelector';
import { useTasksStore } from '../store/tasksStore';
import type { Task, TaskPriority } from '../types/task';

const MAX_TITLE_LENGTH = 100;

interface TaskFormScreenProps {
  taskId?: string;
}

// used for both new and edit; with a taskId it prefills
export function TaskFormScreen({ taskId }: TaskFormScreenProps) {
  const existingTask = useTasksStore((state) => state.tasks.find((task) => task.id === taskId));
  const isLoading = useTasksStore((state) => state.isLoading);

  const screenOptions = <Stack.Screen options={{ headerShown: false }} />;

  if (taskId && isLoading) return <LoadingScreen />;

  if (taskId && !existingTask) {
    // e.g. deleted on another device
    return (
      <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
        {screenOptions}
        <EmptyState
          icon="alert-circle-outline"
          title="Task not found"
          subtitle="It may have been deleted."
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  return (
    <>
      {screenOptions}
      {/* `key` makes React rebuild the form (and its state) if the task id
          changes, instead of showing stale field values. */}
      <TaskForm key={existingTask?.id ?? 'new'} task={existingTask} />
    </>
  );
}

function TaskForm({ task }: { task?: Task }) {
  const createTask = useTasksStore((state) => state.createTask);
  const updateTask = useTasksStore((state) => state.updateTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);
  const toggleComplete = useTasksStore((state) => state.toggleComplete);
  const userId = useAuthStore((state) => state.user?.uid);

  const isEditing = Boolean(task);

  // initial only applies on first render so typing isn't overwritten
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate ?? null);
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium');
  const [completed, setCompleted] = useState(task?.completed ?? false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleSubmit = async () => {
    setSubmitError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Please give your task a title.');
      return;
    }
    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setTitleError(`Title must be ${MAX_TITLE_LENGTH} characters or fewer.`);
      return;
    }
    if (!userId) return;

    setIsSubmitting(true);
    try {
      const input = { title: trimmedTitle, description: description.trim(), dueDate, priority };
      if (task) {
        await updateTask(task.id, input);
        if (completed !== task.completed) await toggleComplete(task.id, completed);
      } else {
        await createTask(userId, input);
      }
      router.back();
    } catch {
      setSubmitError('Could not save the task. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setConfirmingDelete(false);
    await deleteTask(task.id);
    router.back();
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom', 'left', 'right']}>
      <ScreenHeader title={isEditing ? 'Edit task' : 'Create task'} />

      <AppInput
        label="Title"
        icon="create-outline"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setTitleError(null);
        }}
        error={titleError ?? undefined}
        placeholder="e.g. Finish project report"
        autoCapitalize="sentences"
        returnKeyType="next"
        maxLength={MAX_TITLE_LENGTH + 20}
      />
      <AppInput
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        placeholder="Add a few details"
        multiline
        autoCapitalize="sentences"
      />
      <DateField label="Due date" value={dueDate} onChange={setDueDate} />
      <PrioritySelector value={priority} onChange={setPriority} />

      {isEditing ? (
        <View className="mb-5 flex-row items-center justify-between rounded-[14px] border border-cardBorder bg-field px-3.5 py-3">
          <View className="flex-1 pr-3">
            <Text className="font-sansBold text-[15px] text-ink">Mark as completed</Text>
            <Text className="font-sans text-[13px] text-muted">
              {completed ? 'Currently completed' : 'Currently pending'}
            </Text>
          </View>
          <Switch
            value={completed}
            onValueChange={setCompleted}
            trackColor={{ false: colors.subtle, true: colors.primary }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Completed"
          />
        </View>
      ) : null}

      {submitError ? (
        <View className="mb-4 rounded-2xl bg-dangerSoft px-4 py-3">
          <Text className="font-sansSemi text-sm text-dangerInk">{submitError}</Text>
        </View>
      ) : null}

      <View className="mt-2 gap-2.5">
        <AppButton
          label={isEditing ? 'Save changes' : 'Save task'}
          onPress={handleSubmit}
          loading={isSubmitting}
        />
        {isEditing ? (
          <AppButton
            label="Delete task"
            variant="dangerSoft"
            icon="trash-outline"
            onPress={() => setConfirmingDelete(true)}
          />
        ) : (
          <AppButton label="Cancel" variant="ghost" onPress={() => router.back()} />
        )}
      </View>

      <ConfirmDialog
        visible={confirmingDelete}
        title="Delete task?"
        message={`"${task?.title ?? ''}" will be permanently deleted.`}
        confirmLabel="Delete"
        destructive
        icon="trash-outline"
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={handleDelete}
      />
    </ScreenContainer>
  );
}
