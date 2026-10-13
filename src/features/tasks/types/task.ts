export type TaskPriority = 'low' | 'medium' | 'high';

// dates are JS Dates here, tasksService converts from Firestore Timestamps
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

// what the user fills in; id/userId/timestamps are set elsewhere
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
