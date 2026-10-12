import type { Task, TaskFilters } from '@/features/tasks/types/task';

// Pure function: same inputs always give the same output, no Firebase or
// React involved. That makes it trivial to reason about and (if we add
// tests later) trivial to test in isolation.
export function getVisibleTasks(
  tasks: Task[],
  filters: TaskFilters,
  searchQuery: string = '',
): Task[] {
  const query = searchQuery.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    const matchesSearch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query);

    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

    const matchesCompletion =
      filters.completion === 'all' ||
      (filters.completion === 'completed' && task.completed) ||
      (filters.completion === 'incomplete' && !task.completed);

    return matchesSearch && matchesPriority && matchesCompletion;
  });

  // Earliest due date first. Tasks with no due date have nothing to sort
  // by, so they're pushed to the end rather than treated as "overdue" or
  // "due now" — sorting them to the front would be misleading.
  // Ties on due date fall back to creation time so the order is stable
  // instead of depending on whatever order Firestore delivered.
  const byCreated = (a: Task, b: Task) => a.createdAt.getTime() - b.createdAt.getTime();

  return [...filtered].sort((a, b) => {
    if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime() || byCreated(a, b);
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return byCreated(a, b);
  });
}

// How many filter groups differ from "All" (0-2); shown as a badge on the
// filter button.
export function countActiveFilters(filters: TaskFilters): number {
  return (filters.priority !== 'all' ? 1 : 0) + (filters.completion !== 'all' ? 1 : 0);
}

export function hasActiveFilters(filters: TaskFilters): boolean {
  return filters.priority !== 'all' || filters.completion !== 'all';
}
