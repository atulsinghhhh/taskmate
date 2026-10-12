import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_STORAGE_KEY = 'onboarding-completed';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  // True until AsyncStorage has been checked for a saved flag. The root
  // layout uses this (alongside auth's isInitializing) to avoid flashing
  // onboarding or the wrong screen before we know the real state.
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
  // Back to the Welcome screen (used by the back button on Login).
  resetOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasCompletedOnboarding: false,
  isLoading: true,

  completeOnboarding: async () => {
    set({ hasCompletedOnboarding: true });
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  },

  resetOnboarding: async () => {
    set({ hasCompletedOnboarding: false });
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
  },
}));

// Runs once, the first time this module is imported (from the root layout).
// Mirrors the authStore pattern: read the persisted flag, then let the root
// layout's guards react to the store update.
AsyncStorage.getItem(ONBOARDING_STORAGE_KEY).then((value) => {
  useOnboardingStore.setState({ hasCompletedOnboarding: value === 'true', isLoading: false });
});
