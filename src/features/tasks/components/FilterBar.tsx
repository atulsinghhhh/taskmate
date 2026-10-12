import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { hasActiveFilters } from '@/utils/taskFilters';
import { useTasksStore } from '../store/tasksStore';
import type { CompletionFilter, TaskPriority } from '../types/task';

const PRIORITY_OPTIONS: { label: string; value: TaskPriority | 'all' }[] = [
  { label: 'All priorities', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

const COMPLETION_OPTIONS: { label: string; value: CompletionFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Incomplete', value: 'incomplete' },
  { label: 'Completed', value: 'completed' },
];

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function FilterBar() {
  const filters = useTasksStore((state) => state.filters);
  const setFilters = useTasksStore((state) => state.setFilters);
  const clearFilters = useTasksStore((state) => state.clearFilters);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {COMPLETION_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={filters.completion === option.value}
            onPress={() => setFilters({ completion: option.value })}
          />
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {PRIORITY_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={filters.priority === option.value}
            onPress={() => setFilters({ priority: option.value })}
          />
        ))}

        {hasActiveFilters(filters) && (
          <Pressable onPress={clearFilters} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear filters</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingBottom: 8,
  },
  row: {
    gap: 8,
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: '#fff',
  },
  clearButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.danger,
  },
});
