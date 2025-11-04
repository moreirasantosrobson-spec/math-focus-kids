import { Skill, Difficulty, Exercise, Attempt } from '../types';

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateCounting = (difficulty: Difficulty): Omit<Exercise, 'id' | 'skill'> => {
  let start: number, question: string, questionTts: string, answer: string, problem: any;
  const type = 'input';

  if (difficulty === Difficulty.Easy) {
    // What comes next? (small numbers)
    start = randInt(1, 20);
    question = `What number comes after ${start}?`;
    questionTts = `What number comes after ${start}`;
    answer = (start + 1).toString();
    problem = { start, direction: 'forward', step: 1 };
  } else if (difficulty === Difficulty.Medium) {
    const questionType = randInt(1, 2);
    if (questionType === 1) {
      // What comes next? (larger numbers)
      start = randInt(21, 99);
      question = `What number comes after ${start}?`;
      questionTts = `What number comes after ${start}`;
      answer = (start + 1).toString();
      problem = { start, direction: 'forward', step: 1 };
    } else {
      // What comes before?
      start = randInt(10, 50);
      question = `What number comes before ${start}?`;
      questionTts = `What number comes before ${start}`;
      answer = (start - 1).toString();
      problem = { start, direction: 'backward', step: 1 };
    }
  } else { // Hard
    const questionType = randInt(1, 3);
     if (questionType === 1) {
       // What number is between X and Y?
      start = randInt(50, 150);
      question = `What number is between ${start} and ${start + 2}?`;
      questionTts = `What number is between ${start} and ${start + 2}`;
      answer = (start + 1).toString();
      problem = { start, end: start + 2 };
    } else if (questionType === 2) {
      // Count backwards
       start = randInt(100, 200);
       question = `What number comes before ${start}?`;
       questionTts = `What number comes before ${start}`;
       answer = (start - 1).toString();
       problem = { start, direction: 'backward', step: 1 };
    }
    else {
      // Skip counting (by 2, 5, or 10)
      const step = [2, 5, 10][randInt(0, 2)];
      start = randInt(1, 10) * step;
      question = `You are counting by ${step}s. What comes after ${start}?`;
      questionTts = `You are counting by ${step}s. What comes after ${start}`;
      answer = (start + step).toString();
      problem = { start, direction: 'forward', step };
    }
  }

  return {
    difficulty,
    question,
    questionTts,
    problem,
    answer,
    type,
  };
};

const generateAddition = (difficulty: Difficulty): Omit<Exercise, 'id' | 'skill'> => {
  let num1: number, num2: number;
  if (difficulty === Difficulty.Easy) {
    num1 = randInt(1, 10);
    num2 = randInt(1, 10);
  } else if (difficulty === Difficulty.Medium) {
    num1 = randInt(10, 100);
    num2 = randInt(10, 100);
  } else {
    num1 = randInt(100, 1000);
    num2 = randInt(100, 1000);
  }
  return {
    difficulty,
    question: `${num1} + ${num2} = ?`,
    questionTts: `${num1} plus ${num2}`,
    problem: { num1, num2, operator: '+' },
    answer: (num1 + num2).toString(),
    type: 'input',
  };
};

const generateSubtraction = (difficulty: Difficulty): Omit<Exercise, 'id' | 'skill'> => {
    let num1: number, num2: number;
    if (difficulty === Difficulty.Easy) {
        num1 = randInt(5, 20);
        num2 = randInt(1, num1 -1);
    } else if (difficulty === Difficulty.Medium) {
        num1 = randInt(20, 200);
        num2 = randInt(10, num1 - 10);
    } else {
        num1 = randInt(200, 2000);
        num2 = randInt(100, num1-100);
    }
    return {
        difficulty,
        question: `${num1} - ${num2} = ?`,
        questionTts: `${num1} minus ${num2}`,
        problem: { num1, num2, operator: '-' },
        answer: (num1 - num2).toString(),
        type: 'input',
    };
};

const generateMultiplication = (difficulty: Difficulty): Omit<Exercise, 'id' | 'skill'> => {
    let num1: number, num2: number;
    if (difficulty === Difficulty.Easy) {
        num1 = randInt(1, 10);
        num2 = randInt(1, 5);
    } else if (difficulty === Difficulty.Medium) {
        num1 = randInt(2, 12);
        num2 = randInt(2, 12);
    } else {
        num1 = randInt(10, 25);
        num2 = randInt(5, 15);
    }
    return {
        difficulty,
        question: `${num1} × ${num2} = ?`,
        questionTts: `${num1} times ${num2}`,
        problem: { num1, num2, operator: '×' },
        answer: (num1 * num2).toString(),
        type: 'input',
    };
};

const generateDivision = (difficulty: Difficulty): Omit<Exercise, 'id' | 'skill'> => {
    let divisor: number, quotient: number;
    if (difficulty === Difficulty.Easy) {
        divisor = randInt(1, 5);
        quotient = randInt(1, 10);
    } else if (difficulty === Difficulty.Medium) {
        divisor = randInt(2, 12);
        quotient = randInt(2, 12);
    } else {
        divisor = randInt(5, 20);
        quotient = randInt(5, 20);
    }
    const dividend = divisor * quotient;
    return {
        difficulty,
        question: `${dividend} ÷ ${divisor} = ?`,
        questionTts: `${dividend} divided by ${divisor}`,
        problem: { dividend, divisor, operator: '÷' },
        answer: quotient.toString(),
        type: 'input',
    };
};

// Simplified generators for brevity. A full implementation would be more complex.
const generateFractions = (difficulty: Difficulty): Omit<Exercise, 'id' | 'skill'> => {
    // Example: Which is bigger 1/2 or 1/4
    const d1 = randInt(2, 5);
    const d2 = d1 + randInt(1,3);
    const question = `Which is bigger: 1/${d1} or 1/${d2}?`;
    return {
        difficulty,
        question,
        questionTts: question,
        problem: {d1, d2},
        answer: `1/${d1}`,
        type: 'mcq',
        options: [`1/${d1}`, `1/${d2}`]
    };
}

const generateTime = (difficulty: Difficulty): Omit<Exercise, 'id' | 'skill'> => {
    const hour = randInt(1,12);
    const minute = difficulty === Difficulty.Easy ? [0, 15, 30, 45][randInt(0,3)] : randInt(0, 59);
    const minuteStr = minute < 10 ? `0${minute}` : minute.toString();
    const question = "What time is it?";
    return {
        difficulty,
        question,
        questionTts: question,
        problem: { hour, minute },
        answer: `${hour}:${minuteStr}`,
        type: 'clock',
    }
}

// Dummy generators for other skills
const generateDummy = (skill: Skill, difficulty: Difficulty): Omit<Exercise, 'id' | 'skill'> => ({
    difficulty,
    question: `Dummy question for ${skill} (${difficulty})`,
    questionTts: `Dummy question for ${skill} ${difficulty}`,
    problem: {},
    answer: '123',
    type: 'input'
});


export const generateExercise = (skill: Skill, difficulty: Difficulty): Exercise => {
  let exerciseData: Omit<Exercise, 'id' | 'skill'>;

  switch (skill) {
    case Skill.Counting:
        exerciseData = generateCounting(difficulty);
        break;
    case Skill.Addition:
      exerciseData = generateAddition(difficulty);
      break;
    case Skill.Subtraction:
        exerciseData = generateSubtraction(difficulty);
        break;
    case Skill.Multiplication:
        exerciseData = generateMultiplication(difficulty);
        break;
    case Skill.Division:
        exerciseData = generateDivision(difficulty);
        break;
    case Skill.Fractions:
        exerciseData = generateFractions(difficulty);
        break;
    case Skill.Time:
        exerciseData = generateTime(difficulty);
        break;
    case Skill.Decimals:
    case Skill.Percentages:
    case Skill.Money:
    case Skill.Measurements:
    default:
        exerciseData = generateDummy(skill, difficulty);
        break;
  }

  return {
    ...exerciseData,
    id: `${skill}-${difficulty}-${Date.now()}`,
    skill,
  };
};

export const adaptDifficulty = (attempts: Attempt[], currentSkill: Skill, currentDifficulty: Difficulty): Difficulty => {
  const recentAttempts = attempts
    .filter(a => a.skill === currentSkill)
    .slice(-5);

  if (recentAttempts.length < 5) {
    return currentDifficulty;
  }

  const correctCount = recentAttempts.filter(a => a.isCorrect).length;

  if (correctCount >= 4 && currentDifficulty === Difficulty.Easy) return Difficulty.Medium;
  if (correctCount >= 4 && currentDifficulty === Difficulty.Medium) return Difficulty.Hard;
  if (correctCount <= 1 && currentDifficulty === Difficulty.Hard) return Difficulty.Medium;
  if (correctCount <= 1 && currentDifficulty === Difficulty.Medium) return Difficulty.Easy;

  return currentDifficulty;
};