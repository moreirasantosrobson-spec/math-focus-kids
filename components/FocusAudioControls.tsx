import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../hooks/useI18n';

// 🔊 Ajuste os nomes dos arquivos abaixo para bater 100% com o que está em /public/audio
// (mantém os títulos bonitos, mas o campo "file" precisa ser o nome EXATO do mp3 no GitHub)
const TRACKS = [
  {
    id: 'alpha',
    title: 'Binaural — Alfa (10 Hz)',
    subtitle: 'Foco calmo e sustentado',
    file: '/audio/focus-1.mp3.mp3',
  },
  {
    id: 'iso',
    title: 'Isochronic — Beta (15 Hz)',
    subtitle: 'Atenção e estado de alerta',
    file: '/audio/focus-3.mp3.mp3',
  },
  {
    id: 'rain',
    title: 'Chuva Suave',
    subtitle: 'Ambiente relaxante sem distrações',
    file: '/audio/focus-4.mp3.mp3',
  },
  {
    id: 'solfeggio',
    title: '285/417/528 Hz',
    subtitle: 'Equilíbrio e serenidade',
    file: '/audio/focus-5.mp3 285-hz-417-hz-528-hz.mp3',
  },
  {
    id: 'brown',
    title: 'Ruído Marrom',
    subtitle: 'Mascaramento de ruídos externos',
    file: '/audio/focus-6.mp3.mp3',
  },
];

function formatTime(s: number) {
  if (!isFinite(s)) return '0:00';
  const mm = Math.floor(s / 60);
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, '0');
  return `${mm}:${ss}`;
}

const PlayIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);

const VolumeIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a3.5 3.5 0 00-2.38-3.32v6.64A3.5 3.5 0 0016.5 12zm0-7a10.5 10.5 0 010 14v-2.2a8.3 8.3 0 000-9.6V5z" />
  </svg>
);

const FocusAudioControls: React.FC = () => {
  const { t } = useI18n();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);

  const current = useMemo(() => TRACKS[index], [index]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.volume = volume;
  }, [volume]);

  useEffect(() => {
    // quando troca de faixa, começa do zero
    const el = audioRef.current;
    if (!el) return;

    el.pause();
    el.currentTime = 0;
    setTime(0);

    // autoplay ao trocar
    const playNext = async () => {
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };
    playNext();
  }, [current.file]);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;

    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  const onLoaded = () => {
    const el = audioRef.current;
    if (!el) return;
    setDuration(el.duration || 0);
  };

  const onTimeUpdate = () => {
    const el = audioRef.current;
    if (!el) return;
    setTime(el.currentTime || 0);
  };

  const seek = (v: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = v;
    setTime(v);
  };

  return (
    <div className="space-y-4">
      {/* Seletor de faixa */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('settings.selectTrack')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TRACKS.map((trk, i) => (
            <button
              key={trk.id}
              onClick={() => setIndex(i)}
              className={`text-left p-3 rounded-lg border hover:shadow-sm transition ${
                i === index
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="font-semibold">{trk.title}</div>
              {trk.subtitle && (
                <div className="text-sm text-gray-500">{trk.subtitle}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Player */}
      <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="inline-flex items-center justify-center rounded-full w-12 h-12 bg-primary text-white hover:opacity-90 transition"
            aria-label={playing ? t('settings.pause') : t('settings.play')}
            title={playing ? t('settings.pause') : t('settings.play')}
          >
            {playing ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>

          <div className="flex-1">
            <div className="font-semibold leading-tight">{current.title}</div>
            {current.subtitle && (
              <div className="text-xs text-gray-500">{current.subtitle}</div>
            )}

            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs tabular-nums text-gray-500">
                {formatTime(time)}
              </span>
              <input
                type="range"
                min={0}
                max={Math.max(1, duration)}
                step={1}
                value={time}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <span className="text-xs tabular-nums text-gray-500">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="w-40 pl-2">
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <VolumeIcon />
              {t('settings.volume')}
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <audio
          ref={audioRef}
          src={current.file}
          onLoadedMetadata={onLoaded}
          onTimeUpdate={onTimeUpdate}
          loop
        />
      </div>
    </div>
  );
};

export default FocusAudioControls;
