import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AudioType = 'binaural' | 'isochronic' | 'rain' | 'none';

interface FocusState {
  // Audio State
  audioType: AudioType;
  volume: number;
  isPlaying: boolean;
  
  // Pomodoro State
  pomodoroMode: 'work' | 'break';
  isPomodoroActive: boolean;
  timeLeft: number; // in seconds
  workMinutes: number;
  breakMinutes: number;
  pomodoroKey: number; // to force re-render/reset timer

  // Actions
  setAudioType: (type: AudioType) => void;
  setVolume: (volume: number) => void;
  playAudio: () => void;
  pauseAudio: () => void;
  stopAudio: () => void;
  
  // Pomodoro Actions
  setWorkMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  tick: () => void;
  switchMode: () => void;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      // Audio State
      audioType: 'none',
      volume: 0.5,
      isPlaying: false,
      
      // Pomodoro State
      pomodoroMode: 'work',
      isPomodoroActive: false,
      workMinutes: 15,
      breakMinutes: 3,
      timeLeft: 15 * 60,
      pomodoroKey: 0,

      // --- Audio Actions ---
      setAudioType: (type) => set({ audioType: type, isPlaying: false }), // Stop playing when type changes
      setVolume: (volume) => set({ volume }),
      playAudio: () => {
        if (get().audioType !== 'none') {
          set({ isPlaying: true });
        }
      },
      pauseAudio: () => set({ isPlaying: false }),
      stopAudio: () => set({ isPlaying: false, audioType: 'none' }),
      
      // --- Pomodoro Actions ---
      setWorkMinutes: (minutes) => {
        if (!get().isPomodoroActive) {
          set({ workMinutes: minutes, timeLeft: minutes * 60, pomodoroMode: 'work' });
        }
      },
      setBreakMinutes: (minutes) => {
        if (!get().isPomodoroActive) {
          set({ breakMinutes: minutes });
        }
      },
      startPomodoro: () => set({ isPomodoroActive: true }),
      pausePomodoro: () => set({ isPomodoroActive: false }),
      resetPomodoro: () => set((state) => ({
        isPomodoroActive: false,
        pomodoroMode: 'work',
        timeLeft: state.workMinutes * 60,
        pomodoroKey: state.pomodoroKey + 1,
        isPlaying: false, // Also stop audio on reset
      })),
      tick: () => {
        if (get().timeLeft > 0) {
          set((state) => ({ timeLeft: state.timeLeft - 1 }));
        } else {
          get().switchMode();
        }
      },
      switchMode: () => {
        const { pomodoroMode, workMinutes, breakMinutes, isPlaying } = get();
        
        // Pause audio when any timer finishes
        if(isPlaying) {
            get().pauseAudio();
        }

        const newMode = pomodoroMode === 'work' ? 'break' : 'work';
        const newTime = (newMode === 'work' ? workMinutes : breakMinutes) * 60;
        
        set({
          pomodoroMode: newMode,
          timeLeft: newTime,
          isPomodoroActive: true, // Auto-start next phase
        });
      },
    }),
    {
      name: 'math-focus-audio-pomodoro-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ // Only persist these settings
        audioType: state.audioType,
        volume: state.volume,
        workMinutes: state.workMinutes,
        breakMinutes: state.breakMinutes,
      }),
    }
  )
);
