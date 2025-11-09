import React, { useEffect, useRef } from "react";
import { useFocusAudio } from "@/stores/useFocusAudio";

const FocusAudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { src, volume, playing } = useFocusAudio();

  // aplica source e volume quando mudarem
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = src;
    audioRef.current.volume = volume;
  }, [src, volume]);

  // play/pause quando state mudar
  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.play().catch(() => {
        // alguns browsers bloqueiam autoplay, sem problema
      });
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  return (
    <audio ref={audioRef} loop preload="auto" />
  );
};

export default FocusAudioPlayer;
