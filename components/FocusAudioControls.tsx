import React from "react";
import { useFocusAudio } from "../stores/useFocusAudio";

const FocusAudioControls: React.FC = () => {
  const { playing, volume, currentTrack, play, pause, setVolume, setTrack, tracks } =
    useFocusAudio();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-text-main text-center">Áudio de Foco</h2>

      {/* Selecionar faixa de áudio */}
      <select
        value={currentTrack}
        onChange={(e) => setTrack(e.target.value)}
        className="w-full border rounded-md p-2 text-text-main bg-gray-100"
      >
        {Object.entries(tracks).map(([key, name]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>

      {/* Botão Play / Pause */}
      <button
        onClick={playing ? pause : play}
        className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
      >
        {playing ? "⏸ Pausar" : "▶️ Reproduzir"}
      </button>

      {/* Controle de Volume */}
      <label className="block text-center text-sm font-medium text-text-main">
        Volume
      </label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
};

export default FocusAudioControls;
