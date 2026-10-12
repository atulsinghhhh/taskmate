import { useLocalSearchParams } from 'expo-router';
import { TaskFormScreen } from '@/features/tasks/screens/TaskFormScreen';

export default function EditTaskRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TaskFormScreen taskId={id} />;
}
