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
  // True until Firebase finishes checking AsyncStorage for a saved session.
  // The root layout uses this to avoid flashing the login screen for a
  // split second before a saved session is restored.
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
      // No need to set `user` here — the subscription below receives the
      // same update and is the single source of truth for auth state.
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
      // onAuthStateChanged fires before the name is written, so push the
      // finished user into the store ourselves.
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

  // Firebase's updateProfile doesn't re-fire onAuthStateChanged, so update
  // the store's `user` directly once the write succeeds — this is what
  // makes the Profile screen "refresh" after an edit.
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

// Runs once, the first time this module is imported (from the root layout).
// Firebase calls this immediately with the current session (null, or
// restored from AsyncStorage), then again on every login/logout — so
// `user` always reflects the real auth state without screens polling it.
subscribeToAuthChanges((user) => {
  useAuthStore.setState({ user, isInitializing: false });
});
