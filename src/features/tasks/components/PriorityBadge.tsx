import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import type { TaskPriority } from '../types/task';

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  low: colors.priorityLow,
  medium: colors.priorityMedium,
  high: colors.priorityHigh,
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const color = PRIORITY_COLOR[priority];
  return (
    <View style={[styles.badge, { backgroundColor: `${color}1A`, borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{PRIORITY_LABEL[priority]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
