
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Locale } from '../types';

interface SettingsState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  useDyslexicFont: boolean;
  toggleDyslexicFont: () => void;
  isTtsEnabled: boolean;
  toggleTts: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
      isHighContrast: false,
      toggleHighContrast: () => set((state) => ({ isHighContrast: !state.isHighContrast })),
      useDyslexicFont: false,
      toggleDyslexicFont: () => set((state) => ({ useDyslexicFont: !state.useDyslexicFont })),
      isTtsEnabled: true,
      toggleTts: () => set((state) => ({ isTtsEnabled: !state.isTtsEnabled })),
    }),
    {
      name: 'math-focus-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
