export interface SpellingBeePuzzle {
  center: string;
  letters: string[];
  validWords: string[];
  maxPoints: number;
  pangramCount: number;
  pangrams: string[];
  hints: SpellingBeeHints;
}

export interface SpellingBeeHints {
  // Two-letter prefix frequency: { "be": 14, "bi": 4, ... }
  twoLetterCounts: Record<string, number>;
  
  // Grid data: { "b": { "4": 14, "5": 9, ... }, ... }
  wordsByLength: Record<string, Record<number, number>>;
  
  // Column totals: { "4": 20, "5": 17, ... }
  lengthTotals: Record<number, number>;
}

export interface GameSession {
  id: number;
  userId: number; // or siteId if anonymous
  puzzleIndex: number; // index into the puzzles array
  foundWords: string[];
  currentScore: number;
  startedAt: Date;
  completedAt?: Date;
  isComplete: boolean;
}

export interface GameProgress {
  session: GameSession;
  puzzle: SpellingBeePuzzle;
  remainingWords: string[];
  percentComplete: number;
}
