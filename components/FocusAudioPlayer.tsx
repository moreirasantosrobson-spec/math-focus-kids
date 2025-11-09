import React, { useEffect, useRef } from "react";
import { useAudio } from "@/stores/useAudio";

const FocusAudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { enabled, volume, currentSrc } = useAudio();

  // Ao trocar faixa/volume/enable, aplicamos no elemento <audio>
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    // garantir a fonte correta
    if (el.src !== window.location.origin + currentSrc) {
      el.src = currentSrc;
      el.load();
    }

    el.volume = volume;

    if (enabled) {
      // Tocar só após interação do usuário; se falhar, ignora o erro
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [enabled, volume, currentSrc]);

  // Pausar quando o componente desmontar
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <audio ref={audioRef} loop />
    </div>
  );
};

export default FocusAudioPlayer;
