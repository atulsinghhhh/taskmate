import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_STORAGE_KEY = 'onboarding-completed';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  // true until the saved flag is read from AsyncStorage
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
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

// runs once on first import
AsyncStorage.getItem(ONBOARDING_STORAGE_KEY).then((value) => {
  useOnboardingStore.setState({ hasCompletedOnboarding: value === 'true', isLoading: false });
});
