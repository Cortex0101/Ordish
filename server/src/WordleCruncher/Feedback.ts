type Feedback = 'G' | 'Y' | 'B';

// Danish alphabet: A-Z, Æ, Ø, Å
const DANISH_ALPHABET = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'Æ', 'Ø', 'Å'
];
const LETTER_TO_INDEX: Record<string, number> = {};
DANISH_ALPHABET.forEach((ch, idx) => {
  LETTER_TO_INDEX[ch] = idx;
});

/**
 * Given two equal-length strings `guess` and `secret` (A–Z, Æ, Ø, Å only),
 * returns an array of length N with:
 *   G = green (correct letter & position)
 *   Y = yellow (in secret but wrong position)
 *   B = black  (not in secret, or all copies already matched)
 *
 * Runs in O(N) time with a single 29-slot int array and two simple loops.
 */
export function wordleFeedback(guess: string, secret: string): Feedback[] {
  const n = guess.length;
  if (secret.length !== n) {
    throw new Error(`Length mismatch: guess is ${n}, secret is ${secret.length}`);
  }

  const feedback = new Array<Feedback>(n);
  const counts = new Array<number>(29).fill(0);

  // ---- Pass 1: mark greens & tally unmatched secret letters ----
  for (let i = 0; i < n; i++) {
    // Normalize to uppercase
    const gChar = guess[i].toUpperCase();
    const sChar = secret[i].toUpperCase();
    const g = LETTER_TO_INDEX[gChar];
    const s = LETTER_TO_INDEX[sChar];

    if (g !== undefined && s !== undefined && g === s) {
      feedback[i] = 'G';
    } else if (s !== undefined) {
      counts[s]++;              // secret letter s remains available
    } else {
      feedback[i] = 'B';        // any non-alphabet char we treat as “not in secret”
    }
  }

  // ---- Pass 2: mark yellows or blacks for everything not yet green ----
  for (let i = 0; i < n; i++) {
    if (feedback[i] === 'G') continue;
    const gChar = guess[i].toUpperCase();
    const g = LETTER_TO_INDEX[gChar];
    if (g !== undefined && counts[g] > 0) {
      feedback[i] = 'Y';
      counts[g]--;
    } else {
      feedback[i] = 'B';
    }
  }

  return feedback;
}