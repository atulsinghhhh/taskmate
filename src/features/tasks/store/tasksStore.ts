import { create } from 'zustand';
import {
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  setTaskCompleted as setTaskCompletedService,
  subscribeToTasks,
  updateTask as updateTaskService,
} from '../services/tasksService';
import { DEFAULT_TASK_FILTERS, type Task, type TaskFilters, type TaskInput } from '../types/task';

interface TasksState {
  tasks: Task[];
  filters: TaskFilters;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;

  startListening: (userId: string) => void;
  stopListening: () => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  clearError: () => void;
  createTask: (userId: string, input: TaskInput) => Promise<void>;
  updateTask: (taskId: string, input: TaskInput) => Promise<void>;
  toggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  filters: DEFAULT_TASK_FILTERS,
  searchQuery: '',
  isLoading: true,
  error: null,
  unsubscribe: null,

  // Called once, when we know who the signed-in user is (see (app)/_layout.tsx).
  startListening: (userId) => {
    get().unsubscribe?.();
    set({ isLoading: true, error: null });
    const unsubscribe = subscribeToTasks(userId, (tasks) => {
      set({ tasks, isLoading: false });
    });
    set({ unsubscribe });
  },

  // Called on logout so we stop listening and don't leak the previous
  // user's tasks into the next person who logs in on this device.
  stopListening: () => {
    get().unsubscribe?.();
    set({
      unsubscribe: null,
      tasks: [],
      isLoading: true,
      searchQuery: '',
      filters: DEFAULT_TASK_FILTERS,
    });
  },

  setFilters: (partialFilters) =>
    set((state) => ({ filters: { ...state.filters, ...partialFilters } })),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  clearFilters: () => set({ filters: DEFAULT_TASK_FILTERS }),

  clearError: () => set({ error: null }),

  createTask: async (userId, input) => {
    try {
      await createTaskService(userId, input);
    } catch {
      set({ error: 'Could not save task. Check your connection and try again.' });
      throw new Error('create-task-failed');
    }
  },

  updateTask: async (taskId, input) => {
    try {
      await updateTaskService(taskId, input);
    } catch {
      set({ error: 'Could not save changes. Check your connection and try again.' });
      throw new Error('update-task-failed');
    }
  },

  // Deliberately doesn't re-throw: toggling completion happens from a tap
  // on the list, where there's no form to show a validation-style error —
  // the store's `error` field is enough to surface a banner if needed.
  toggleComplete: async (taskId, completed) => {
    try {
      await setTaskCompletedService(taskId, completed);
    } catch {
      set({ error: 'Could not update task. Check your connection and try again.' });
    }
  },

  deleteTask: async (taskId) => {
    try {
      await deleteTaskService(taskId);
    } catch {
      set({ error: 'Could not delete task. Check your connection and try again.' });
    }
  },
}));
