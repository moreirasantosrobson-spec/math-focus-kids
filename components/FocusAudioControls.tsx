import React from "react";
import { useAudio } from "@/stores/useAudio";

const FocusAudioControls: React.FC = () => {
  const { enabled, setEnabled, volume, setVolume, tracks, currentSrc, setTrack } = useAudio();

  return (
    <section className="mt-8 rounded-xl border p-4 md:p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Áudio de Foco</h2>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Ativar áudio de foco</span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition" />
          <span className="ml-3 text-sm">{enabled ? "Ligado" : "Desligado"}</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Volume</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-xs text-gray-500 mt-1">{Math.round(volume * 100)}%</div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Faixa</label>
        <select
          value={currentSrc}
          onChange={(e) => setTrack(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        >
          {tracks.map((t) => (
            <option key={t.src} value={t.src}>
              {t.title}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default FocusAudioControls;
