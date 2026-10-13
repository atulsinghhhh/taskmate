import type { Task, TaskFilters } from '@/features/tasks/types/task';

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

  // earliest due first, no due date goes last, ties use createdAt for a stable order
  const byCreated = (a: Task, b: Task) => a.createdAt.getTime() - b.createdAt.getTime();

  return [...filtered].sort((a, b) => {
    if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime() || byCreated(a, b);
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return byCreated(a, b);
  });
}

// number of filter groups not on All, for the badge
export function countActiveFilters(filters: TaskFilters): number {
  return (filters.priority !== 'all' ? 1 : 0) + (filters.completion !== 'all' ? 1 : 0);
}

export function hasActiveFilters(filters: TaskFilters): boolean {
  return filters.priority !== 'all' || filters.completion !== 'all';
}
