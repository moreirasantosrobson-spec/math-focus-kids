
import { Skill } from './types';

export const SUPPORTED_LOCALES = ['en', 'fr', 'pt'] as const;

export const SKILLS_LIST: Skill[] = [
  Skill.Counting,
  Skill.Addition,
  Skill.Subtraction,
  Skill.Multiplication,
  Skill.Division,
  Skill.Fractions,
  Skill.Decimals,
  Skill.Percentages,
  Skill.Time,
  Skill.Money,
  Skill.Measurements,
];

export const SRS_INTERVALS = [1, 3, 7]; // in days
