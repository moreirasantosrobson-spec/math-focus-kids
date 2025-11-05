import React, { useEffect, useRef, useState } from "react";

const FocusAudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} loop>
        <source src="/audio/focus-sound.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={toggleAudio}
        className="px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow-lg hover:scale-105 transition"
      >
        {playing ? "Pausar Som" : "Ativar Foco"}
      </button>
    </div>
  );
};

export default FocusAudioPlayer;
