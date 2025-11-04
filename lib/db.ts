// FIX: Dexie should be imported as a default export, not a named export, to ensure correct type inheritance for the Dexie class.
import Dexie, { Table } from 'dexie';
import { Attempt } from '../types';

export class MathFocusDB extends Dexie {
  // FIX: It's good practice to specify the key type for a Dexie Table. '++id' implies a number key.
  attempts!: Table<Attempt, number>;

  constructor() {
    super('MathFocusDB');
    this.version(1).stores({
      attempts: '++id, exerciseId, skill, difficulty, isCorrect, timestamp',
    });
  }
}

export const db = new MathFocusDB();