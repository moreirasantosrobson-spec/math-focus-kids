
import React, { useRef, useEffect, useState } from 'react';
import { useFocusStore, AudioType } from '../../stores/useFocusStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useI18n } from '../../hooks/useI18n';
import PlayIcon from '../icons/PlayIcon';
import PauseIcon from '../icons/PauseIcon';
import StopIcon from '../icons/StopIcon';
import HeadphonesIcon from '../icons/HeadphonesIcon';

// IMPORTANT: Place your audio files in the `public/audio` directory
// For example: /public/audio/binaural-alpha.mp3
const audioSources: Record<Exclude<AudioType, 'none'>, { name: string; files: { src: string; type: string }[] }> = {
  binaural: {
    name: 'Binaural Beats (Alpha)',
    files: [
      { src: '/audio/binaural-alpha.mp3', type: 'audio/mpeg' },
      { src: '/audio/binaural-alpha.ogg', type: 'audio/ogg' },
    ],
  },
  isochronic: {
    name: 'Isochronic Tones (10Hz)',
    files: [
      { src: '/audio/isochronic-10hz.mp3', type: 'audio/mpeg' },
      { src: '/audio/isochronic-10hz.ogg', type: 'audio/ogg' },
    ],
  },
  rain: {
    name: 'Gentle Rain',
    files: [
      { src: '/audio/gentle-rain.mp3', type: 'audio/mpeg' },
      { src: '/audio/gentle-rain.ogg', type: 'audio/ogg' },
    ],
  },
};

const FocusAudioPlayer: React.FC = () => {
  const { t } = useI18n();
  const { isTtsEnabled } = useSettingsStore();
  const {
    audioType,
    volume,
    isPlaying,
    setAudioType,
    setVolume,
    playAudio,
    pauseAudio,
    stopAudio,
  } = useFocusStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [showHeadphoneWarning, setShowHeadphoneWarning] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && audioType !== 'none') {
      audio.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, audioType]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // When the audio type changes, load the new source
    const audio = audioRef.current;
    if (audio && audioType !== 'none') {
      audio.load();
      // If a new type is selected, we might want to auto-play it if the user was already in a "playing" context.
      // For now, we let playAudio() handle the play command explicitly for user consent.
    }
  }, [audioType]);

  const speak = (text: string) => {
    if (isTtsEnabled && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const handleTypeChange = (type: AudioType) => {
    setAudioType(type);
    if (type === 'binaural') {
      setShowHeadphoneWarning(true);
      speak(t('focusAudio.headphoneWarning'));
    } else {
      setShowHeadphoneWarning(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-md mt-4">
      <audio ref={audioRef} loop>
        {audioType !== 'none' && audioSources[audioType].files.map(file => (
          <source key={file.src} src={file.src} type={file.type} />
        ))}
        Your browser does not support the audio element.
      </audio>

      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-center text-text-main">{t('focusAudio.title')}</h3>
        
        {/* Sound Type Selection */}
        <div className="flex justify-center items-center gap-2 flex-wrap">
          {(Object.keys(audioSources) as Exclude<AudioType, 'none'>[]).map(type => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              aria-pressed={audioType === type}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                audioType === type 
                ? 'bg-primary text-white ring-2 ring-offset-2 ring-primary-dark' 
                : 'bg-gray-200 text-text-main hover:bg-gray-300'
              }`}
            >
              {t(`focusAudio.${type}`)}
            </button>
          ))}
        </div>
        
        {showHeadphoneWarning && (
          <div className="flex items-center justify-center gap-2 p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md" role="alert">
            <HeadphonesIcon className="w-5 h-5" />
            <span className="text-sm">{t('focusAudio.headphoneWarning')}</span>
          </div>
        )}

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={isPlaying ? pauseAudio : playAudio}
            disabled={audioType === 'none'}
            aria-label={isPlaying ? t('focusAudio.pause') : t('focusAudio.play')}
            className="p-3 rounded-full bg-primary text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>
          <button
            onClick={stopAudio}
            disabled={audioType === 'none' || !isPlaying}
            aria-label={t('focusAudio.stop')}
            className="p-3 rounded-full bg-red-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <StopIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 w-1/2">
            <label htmlFor="volume-slider" className="sr-only">{t('focusAudio.volume')}</label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-label={t('focusAudio.volume')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusAudioPlayer;
