
export type Locale = 'pt' | 'en' | 'fr';

export enum Skill {
  Counting = 'counting',
  Addition = 'addition',
  Subtraction = 'subtraction',
  Multiplication = 'multiplication',
  Division = 'division',
  Fractions = 'fractions',
  Decimals = 'decimals',
  Percentages = 'percentages',
  Time = 'time',
  Money = 'money',
  Measurements = 'measurements',
}

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export interface Exercise {
  id: string;
  skill: Skill;
  difficulty: Difficulty;
  question: string;
  questionTts: string;
  problem: any; // Contains the raw data for the problem, e.g., { num1: 10, num2: 5, operator: '+' }
  answer: string;
  hint?: string;
  type: 'input' | 'mcq' | 'clock'; // Type of interaction
  options?: string[]; // For MCQ
}

export interface Attempt {
  exerciseId: string;
  skill: Skill;
  difficulty: Difficulty;
  isCorrect: boolean;
  confidence: number; // 1-3
  timestamp: number;
  timeTaken: number; // in milliseconds
}

export interface Progress {
  attempts: Attempt[];
}
