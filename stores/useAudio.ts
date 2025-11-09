import { create } from "zustand";

type Track = { title: string; src: string };

type AudioState = {
  enabled: boolean;
  volume: number; // 0..1
  currentSrc: string;
  tracks: Track[];
  setEnabled: (v: boolean) => void;
  setVolume: (v: number) => void;
  setTrack: (src: string) => void;
};

export const useAudio = create<AudioState>((set, get) => ({
  enabled: true,
  volume: 0.6,
  // defina uma das faixas como padrão:
  currentSrc: "/audio/ambient-music-meditationcalmingzenspiritual-music-315452.mp3",
  // ajuste os nomes exatamente como estão no diretório /public/audio
  tracks: [
    { title: "Música Ambiente (Calma)", src: "/audio/ambient-music-meditationcalmingzenspiritual-music-315452.mp3" },
    { title: "Alfa 8–12 Hz (Foco Suave)", src: "/audio/alpha-8-to-12-hz-healing-frequencies-222944.mp3" },
    { title: "Human Code Unity (Espiritual)", src: "/audio/human-code-unity-hcu-frequency-spiritual-1.mp3" },
    // Se tiver arquivos “breath-of-life…”, pode adicionar:
    // { title: "Respiração da Vida (5 min)", src: "/audio/breath-of-life_5-minutes-320858.mp3" },
    // { title: "Respiração da Vida (10 min)", src: "/audio/breath-of-life_10-minutes-320859.mp3" },
  ],
  setEnabled: (v) => set({ enabled: v }),
  setVolume: (v) => set({ volume: Math.min(1, Math.max(0, v)) }),
  setTrack: (src) => {
    const found = get().tracks.find((t) => t.src === src);
    if (found) set({ currentSrc: found.src });
  },
}));
