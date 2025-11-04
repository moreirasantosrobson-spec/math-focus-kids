import React, { useState, useEffect, useRef } from 'react';
import { Exercise, Attempt } from '../types';
import { useI18n } from '../hooks/useI18n';
import { useSettingsStore } from '../stores/useSettingsStore';
import SpeakerIcon from './icons/SpeakerIcon';
import HintIcon from './icons/HintIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';

interface ExercisePlayerProps {
  exercise: Exercise;
  onComplete: (attempt: Attempt) => void;
}

const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ exercise, onComplete }) => {
  const { t, locale } = useI18n();
  const { isTtsEnabled } = useSettingsStore();
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [confidence, setConfidence] = useState<number>(0);
  const [showHint, setShowHint] = useState(false);
  const startTime = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const [isListening, setIsListening] = useState(false);
  // FIX: The `SpeechRecognition` type is not available in standard TypeScript DOM definitions. Using `any` to avoid a compilation error.
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowFeedback(false);
    setConfidence(0);
    setShowHint(false);
    startTime.current = Date.now();
    inputRef.current?.focus();
    speak(exercise.questionTts);
    
    // FIX: The `SpeechRecognition` and `webkitSpeechRecognition` properties are non-standard and not present on the `window` type. Cast to `any` to access them.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = locale;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        // For math problems, remove trailing periods.
        setUserAnswer(transcript.replace(/\.$/, ''));
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (isListening) setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };

  }, [exercise, locale]);

  const speak = (text: string) => {
    if (isTtsEnabled && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showFeedback) return;

    const correct = userAnswer.trim() === exercise.answer.toString();
    setIsCorrect(correct);
    setShowFeedback(true);
    speak(correct ? t('practice.correct') : t('practice.incorrect'));

    if (correct || confidence > 0) { // Submit if correct or if confidence is selected
        const attempt: Attempt = {
            exerciseId: exercise.id,
            skill: exercise.skill,
            difficulty: exercise.difficulty,
            isCorrect: correct,
            confidence: confidence || 1,
            timestamp: Date.now(),
            timeTaken: Date.now() - startTime.current,
        };
        // Delay onComplete to show feedback
        setTimeout(() => onComplete(attempt), correct ? 1500 : 3000);
    }
  };

  const handleNext = () => {
    const attempt: Attempt = {
      exerciseId: exercise.id,
      skill: exercise.skill,
      difficulty: exercise.difficulty,
      isCorrect: isCorrect || false,
      confidence: confidence || 1,
      timestamp: Date.now(),
      timeTaken: Date.now() - startTime.current,
    };
    onComplete(attempt);
  };

  const handleListen = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Could not start recognition:", error);
      }
    }
  };


  const feedbackClasses = isCorrect ? 'bg-green-100 text-correct border-green-500' : 'bg-red-100 text-incorrect border-red-500';
  const feedbackText = isCorrect ? t('practice.correct') : t('practice.incorrect');

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-2xl space-y-8 min-h-[60vh]">
      <div className="w-full text-center">
        <div className="flex items-center justify-center gap-4">
          <p className="text-4xl md:text-6xl font-bold text-text-main" aria-live="polite">
            {exercise.question}
          </p>
          <button onClick={() => speak(exercise.questionTts)} aria-label="Read question aloud" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <SpeakerIcon className="w-8 h-8 text-primary" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={showFeedback}
            className="w-full p-4 pr-16 text-3xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
            aria-label="Your answer"
          />
          {recognitionRef.current && (
            <button
              type="button"
              onClick={handleListen}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full transition-colors ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Use microphone to answer'}
            >
              <MicrophoneIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {showFeedback && (
          <div className={`p-4 rounded-lg text-2xl font-semibold text-center border-2 ${feedbackClasses}`} role="alert">
            {feedbackText}
            {!isCorrect && <p className="text-lg mt-2">{t('practice.finalAnswer', { answer: exercise.answer })}</p>}
          </div>
        )}
        
        {!showFeedback && (
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-xl font-semibold text-text-light">{t('practice.confidence')}</h3>
            <div className="flex space-x-4">
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setConfidence(level)}
                  className={`px-6 py-3 rounded-lg text-lg font-bold transition-transform transform hover:scale-105 ${confidence === level ? 'bg-primary text-white ring-2 ring-offset-2 ring-primary-dark' : 'bg-gray-200 text-text-main'}`}
                >
                  {t(`practice.confidence_${level}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center pt-4">
          {showFeedback ? (
            <button
              type="button"
              onClick={handleNext}
              className="w-1/2 py-4 text-2xl font-bold text-white bg-secondary rounded-lg hover:bg-green-500 transition-colors"
            >
              {t('practice.next')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={!userAnswer.trim() || !confidence}
              className="w-1/2 py-4 text-2xl font-bold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {t('practice.submit')}
            </button>
          )}
        </div>
      </form>

      {exercise.hint && (
        <div className="absolute top-4 right-4">
          <button onClick={() => setShowHint(!showHint)} className="p-2 rounded-full hover:bg-gray-200">
            <HintIcon className="w-6 h-6 text-gray-500" />
          </button>
          {showHint && <div className="absolute right-0 mt-2 w-48 p-2 bg-white rounded-lg shadow-xl text-sm text-text-main">{exercise.hint}</div>}
        </div>
      )}
    </div>
  );
};

export default ExercisePlayer;