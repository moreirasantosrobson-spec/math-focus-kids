import { create } from 'zustand';
import { Attempt } from '../types';
import { db } from '../lib/db';

type ProgressState = {
  attempts: Attempt[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  addAttempt: (attempt: Attempt) => Promise<void>;
  clearAttempts: () => Promise<void>;
};

const STORAGE_KEY = 'mfk_attempts';

function readFromLocalStorage(): Attempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeToLocalStorage(attempts: Attempt[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  } catch {
    // ignore
  }
}

const useProgressStore = create<ProgressState>((set, get) => ({
  attempts: [],
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;

    try {
      const attemptsFromDB = await db.attempts.toArray();
      if (attemptsFromDB && attemptsFromDB.length) {
        set({ attempts: attemptsFromDB, isInitialized: true });
        writeToLocalStorage(attemptsFromDB);
        return;
      }
    } catch {
      // segue para fallback
    }

    const attemptsFromLS = readFromLocalStorage();
    set({ attempts: attemptsFromLS, isInitialized: true });
  },

  addAttempt: async (attempt: Attempt) => {
    try {
      await db.attempts.add(attempt);
    } catch {
      // ignore
    }

    set((state) => {
      const next = [...state.attempts, attempt];
      writeToLocalStorage(next);
      return { attempts: next };
    });
  },

  clearAttempts: async () => {
    // limpa IndexedDB
    try {
      await db.attempts.clear();
    } catch {
      // ignore
    }
    // limpa memória e localStorage
    set({ attempts: [] });
    writeToLocalStorage([]);
  },
}));

export default useProgressStore;
