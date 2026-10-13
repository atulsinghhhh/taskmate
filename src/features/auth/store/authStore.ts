import { create } from 'zustand';
import {
  loginWithEmail,
  logout as logoutService,
  registerWithEmail,
  subscribeToAuthChanges,
  updateDisplayName as updateDisplayNameService,
} from '../services/authService';
import type { AuthError, AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  // true until firebase restores the saved session
  isInitializing: boolean;
  isSubmitting: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitializing: true,
  isSubmitting: false,
  error: null,

  login: async (email, password) => {
    set({ isSubmitting: true, error: null });
    try {
      await loginWithEmail(email, password);
      // user gets set by the subscription below
    } catch (error) {
      set({ error: (error as AuthError).message });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  register: async (email, password, displayName) => {
    set({ isSubmitting: true, error: null });
    try {
      const created = await registerWithEmail(email, password, displayName);
      // onAuthStateChanged fires before the name is written, so set user here
      set({ user: created });
    } catch (error) {
      set({ error: (error as AuthError).message });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  logout: async () => {
    await logoutService();
  },

  // updateProfile doesn't re-fire onAuthStateChanged, so set user here
  updateDisplayName: async (displayName) => {
    set({ isSubmitting: true, error: null });
    try {
      await updateDisplayNameService(displayName);
      set((state) => (state.user ? { user: { ...state.user, displayName } } : state));
    } catch (error) {
      set({ error: (error as AuthError).message });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  clearError: () => set({ error: null }),
}));

// runs once on first import
subscribeToAuthChanges((user) => {
  useAuthStore.setState({ user, isInitializing: false });
});
