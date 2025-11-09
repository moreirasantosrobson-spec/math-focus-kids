import { create } from "zustand";

type FocusAudioState = {
  src: string;
  volume: number; // 0.0 a 1.0
  playing: boolean;
  setSrc: (src: string) => void;
  setVolume: (v: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
};

export const useFocusAudio = create<FocusAudioState>((set, get) => ({
  src: "/audio/focus-sound.mp3",
  volume: 0.5,
  playing: false,
  setSrc: (src) => set({ src }),
  setVolume: (volume) => {
    if (volume < 0) volume = 0;
    if (volume > 1) volume = 1;
    set({ volume });
  },
  play: () => set({ playing: true }),
  pause: () => set({ playing: false }),
  toggle: () => set({ playing: !get().playing }),
}));
