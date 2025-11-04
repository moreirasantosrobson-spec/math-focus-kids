
import { create } from 'zustand';
import { Attempt } from '../types';
import { db } from '../lib/db';

interface ProgressState {
  attempts: Attempt[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  addAttempt: (attempt: Attempt) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  attempts: [],
  isInitialized: false,
  initialize: async () => {
    if (get().isInitialized) return;
    const attempts = await db.attempts.toArray();
    set({ attempts, isInitialized: true });
  },
  addAttempt: async (attempt) => {
    await db.attempts.add(attempt);
    set((state) => ({ attempts: [...state.attempts, attempt] }));
  },
}));

// Initialize store on app load
useProgressStore.getState().initialize();
