import React, { useEffect, useState, useMemo } from 'react';
import { useFocusStore } from '../../stores/useFocusStore';
import { useI18n } from '../../hooks/useI18n';

const PomodoroTimer: React.FC = () => {
  const { t } = useI18n();
  const {
    isPomodoroActive,
    timeLeft,
    pomodoroMode,
    workMinutes,
    breakMinutes,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    tick,
    setWorkMinutes,
    setBreakMinutes,
    playAudio,
    isPlaying,
    audioType,
    pomodoroKey,
  } = useFocusStore();

  const [wasPlayingAudio, setWasPlayingAudio] = useState(false);

  // This effect manages the countdown timer.
  useEffect(() => {
    // FIX: Replaced `NodeJS.Timeout` with `ReturnType<typeof setInterval>` for browser compatibility, as `setInterval` returns a number in browser environments, not a Node.js Timeout object.
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPomodoroActive) {
      timer = setInterval(() => tick(), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPomodoroActive, tick, pomodoroKey]);

  // This effect tracks if audio was playing when a work session ends.
  useEffect(() => {
    if (pomodoroMode === 'break') {
      setWasPlayingAudio(isPlaying);
    }
  }, [pomodoroMode]);
  
  // Reset the "wasPlayingAudio" state if the timer is manually reset.
  useEffect(() => {
      setWasPlayingAudio(false);
  }, [pomodoroKey]);


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const workOptions = [10, 15, 20];
  const breakOptions = [2, 3, 5];

  const canResumeAudio = useMemo(() => {
      return wasPlayingAudio && pomodoroMode === 'work' && audioType !== 'none' && !isPlaying;
  }, [wasPlayingAudio, pomodoroMode, audioType, isPlaying]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-md text-center">
      <div
        className="text-6xl font-bold font-mono p-4 mb-4 rounded-lg"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatTime(timeLeft)}
      </div>

      <div className="mb-4 text-lg font-semibold uppercase tracking-wider" role="status">
        {pomodoroMode === 'work' ? t('pomodoro.workPhase') : t('pomodoro.breakPhase')}
      </div>
      
      <div className="flex justify-center items-center gap-4 mb-4">
        {!isPomodoroActive ? (
          <button onClick={startPomodoro} className="px-6 py-3 bg-primary text-white rounded-lg font-bold text-lg">
            {t('pomodoro.start')}
          </button>
        ) : (
          <button onClick={pausePomodoro} className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold text-lg">
            {t('pomodoro.pause')}
          </button>
        )}
        <button onClick={resetPomodoro} className="px-6 py-3 bg-gray-500 text-white rounded-lg font-bold text-lg">
          {t('pomodoro.reset')}
        </button>
      </div>

      {canResumeAudio && (
        <div className="my-2">
            <button onClick={playAudio} className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold animate-pulse">
                {t('pomodoro.resumeAudio')}
            </button>
        </div>
      )}

      {/* Settings for when timer is idle */}
      {!isPomodoroActive && (
        <div className="flex justify-center items-center gap-6 mt-4 pt-4 border-t">
          <div>
            <label htmlFor="work-minutes" className="block text-sm font-medium text-gray-700">{t('pomodoro.workDuration')}</label>
            <select
              id="work-minutes"
              value={workMinutes}
              onChange={(e) => setWorkMinutes(Number(e.target.value))}
              className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              {workOptions.map(min => <option key={min} value={min}>{`${min} min`}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="break-minutes" className="block text-sm font-medium text-gray-700">{t('pomodoro.breakDuration')}</label>
            <select
              id="break-minutes"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
               className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              {breakOptions.map(min => <option key={min} value={min}>{`${min} min`}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;