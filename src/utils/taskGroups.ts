import type { Task } from '@/features/tasks/types/task';

export type TaskSectionKey = 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'none' | 'earlier';

export interface TaskSection {
  key: TaskSectionKey;
  title: string;
  data: Task[];
}

const SECTION_ORDER: { key: TaskSectionKey; title: string }[] = [
  { key: 'overdue', title: 'Overdue' },
  { key: 'today', title: 'Today' },
  { key: 'tomorrow', title: 'Tomorrow' },
  { key: 'upcoming', title: 'Upcoming' },
  { key: 'none', title: 'No due date' },
  { key: 'earlier', title: 'Earlier' }, // past due dates, already completed
];

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function sectionKeyFor(task: Task, todayStart: number): TaskSectionKey {
  if (!task.dueDate) return 'none';
  const dayStart = startOfDay(task.dueDate);

  if (dayStart < todayStart) return task.completed ? 'earlier' : 'overdue';
  if (dayStart === todayStart) return 'today';
  // compare calendar days, adding 24h breaks on DST
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dayStart === tomorrow.getTime()) return 'tomorrow';
  return 'upcoming';
}

// empty sections are dropped
export function groupTasksByDueDay(tasks: Task[], now: Date = new Date()): TaskSection[] {
  const todayStart = startOfDay(now);
  const buckets = new Map<TaskSectionKey, Task[]>();

  for (const task of tasks) {
    const key = sectionKeyFor(task, todayStart);
    buckets.set(key, [...(buckets.get(key) ?? []), task]);
  }

  return SECTION_ORDER.filter(({ key }) => buckets.has(key)).map(({ key, title }) => ({
    key,
    title,
    data: buckets.get(key)!,
  }));
}
