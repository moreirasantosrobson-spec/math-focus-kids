import { create } from 'zustand';
import { Attempt } from '../types';
import { db } from '../lib/db';

type ProgressState = {
  attempts: Attempt[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  addAttempt: (attempt: Attempt) => Promise<void>;
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
    // ignore storage errors
  }
}

const useProgressStore = create<ProgressState>((set, get) => ({
  attempts: [],
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;

    try {
      // 1) tenta buscar do IndexedDB (Dexie)
      const attemptsFromDB = await db.attempts.toArray();
      if (attemptsFromDB && attemptsFromDB.length) {
        set({ attempts: attemptsFromDB, isInitialized: true });
        // mantém localStorage em sincronia
        writeToLocalStorage(attemptsFromDB);
        return;
      }
    } catch {
      // se o IndexedDB falhar, seguimos para o fallback
    }

    // 2) fallback: tenta localStorage
    const attemptsFromLS = readFromLocalStorage();
    set({ attempts: attemptsFromLS, isInitialized: true });
  },

  addAttempt: async (attempt: Attempt) => {
    // salva no IndexedDB (se falhar, seguimos sem travar)
    try {
      await db.attempts.add(attempt);
    } catch {
      // ignore
    }

    // atualiza estado em memória
    set((state) => {
      const next = [...state.attempts, attempt];
      // espelha no localStorage
      writeToLocalStorage(next);
      return { attempts: next };
    });
  },
}));

export default useProgressStore;
