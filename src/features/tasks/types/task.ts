export type TaskPriority = 'low' | 'medium' | 'high';

// A task as used throughout the app (dates as JS Date objects — easy to
// sort/compare/format). Firestore stores dates as Timestamps; the task
// service converts between the two at the boundary (see tasksService.ts).
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: TaskPriority;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Fields the user actually fills in when creating/editing a task. The
// server (Firestore) is responsible for id/userId/createdAt/updatedAt.
export interface TaskInput {
  title: string;
  description: string;
  dueDate: Date | null;
  priority: TaskPriority;
}

export type CompletionFilter = 'all' | 'completed' | 'incomplete';

export interface TaskFilters {
  priority: TaskPriority | 'all';
  completion: CompletionFilter;
}

export const DEFAULT_TASK_FILTERS: TaskFilters = {
  priority: 'all',
  completion: 'all',
};
