
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Skill, Difficulty, Attempt, Exercise } from '../types';
import { useI18n } from '../hooks/useI18n';
import { useProgressStore } from '../stores/useProgressStore';
import { generateExercise, adaptDifficulty } from '../services/exerciseGenerator';
import ExercisePlayer from '../components/ExercisePlayer';
import PomodoroTimer from '../components/focus/PomodoroTimer';
import FocusAudioPlayer from '../components/audio/FocusAudioPlayer';
import { useFocusStore } from '../stores/useFocusStore';

const Practice: React.FC = () => {
  const { skill } = useParams<{ skill: Skill }>();
  const { locale } = useI18n();
  const navigate = useNavigate();
  const { attempts, addAttempt } = useProgressStore();
  const { stopAudio, resetPomodoro } = useFocusStore();

  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  
  // Using useCallback to prevent re-generation on every render, only when deps change.
  const generateNewExercise = useCallback((currentDifficulty: Difficulty): Exercise | null => {
    if (!skill) return null;
    return generateExercise(skill, currentDifficulty);
  }, [skill]);
  
  const [currentExercise, setCurrentExercise] = useState(() => generateNewExercise(difficulty));

  useEffect(() => {
    // Stop audio and reset timer when leaving the practice page
    return () => {
      stopAudio();
      resetPomodoro();
    };
  }, [stopAudio, resetPomodoro]);

  useEffect(() => {
    if (!skill) {
      navigate(`/${locale}/dashboard`);
    }
  }, [skill, locale, navigate]);

  const handleComplete = (attempt: Attempt) => {
    addAttempt(attempt);
    const allAttempts = [...attempts, attempt];
    const newDifficulty = adaptDifficulty(allAttempts, skill!, difficulty);
    
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty);
    }
    
    setCurrentExercise(generateNewExercise(newDifficulty));
  };

  if (!currentExercise) {
    return <div>Loading exercise...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start h-full space-y-4">
      <PomodoroTimer />
      <FocusAudioPlayer />
      <ExercisePlayer exercise={currentExercise} onComplete={handleComplete} />
    </div>
  );
};

export default Practice;
