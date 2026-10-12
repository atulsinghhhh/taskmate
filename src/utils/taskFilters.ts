import type { Task, TaskFilters } from '@/features/tasks/types/task';

// Pure function: same inputs always give the same output, no Firebase or
// React involved. That makes it trivial to reason about and (if we add
// tests later) trivial to test in isolation.
export function getVisibleTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const filtered = tasks.filter((task) => {
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

    const matchesCompletion =
      filters.completion === 'all' ||
      (filters.completion === 'completed' && task.completed) ||
      (filters.completion === 'incomplete' && !task.completed);

    return matchesPriority && matchesCompletion;
  });

  // Earliest due date first. Tasks with no due date have nothing to sort
  // by, so they're pushed to the end rather than treated as "overdue" or
  // "due now" — sorting them to the front would be misleading.
  return [...filtered].sort((a, b) => {
    if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime();
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return 0;
  });
}

export function hasActiveFilters(filters: TaskFilters): boolean {
  return filters.priority !== 'all' || filters.completion !== 'all';
}
