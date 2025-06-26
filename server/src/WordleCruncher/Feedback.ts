type Feedback = 'G' | 'Y' | 'B';

/**
 * Given two equal-length strings `guess` and `secret` (A–Z only),
 * returns an array of length N with:
 *   G = green (correct letter & position)
 *   Y = yellow (in secret but wrong position)
 *   B = black  (not in secret, or all copies already matched)
 *
 * Runs in O(N) time with a single 26-slot int array and two simple loops.
 */
export function wordleFeedback(guess: string, secret: string): Feedback[] {
  const n = guess.length;
  if (secret.length !== n) {
    throw new Error(`Length mismatch: guess is ${n}, secret is ${secret.length}`);
  }

  const feedback = new Array<Feedback>(n);
  const counts = new Array<number>(26).fill(0);

  // ---- Pass 1: mark greens & tally unmatched secret letters ----
  for (let i = 0; i < n; i++) {
    // map 'A'..'Z' → 0..25
    const g = guess.charCodeAt(i) - 65;
    const s = secret.charCodeAt(i) - 65;

    if (g === s && g >= 0 && g < 26) {
      feedback[i] = 'G';
    } else if (s >= 0 && s < 26) {
      counts[s]++;              // secret letter s remains available
    } else {
      feedback[i] = 'B';        // any non-A–Z char we treat as “not in secret”
    }
  }

  // ---- Pass 2: mark yellows or blacks for everything not yet green ----
  for (let i = 0; i < n; i++) {
    if (feedback[i] === 'G') continue;

    const g = guess.charCodeAt(i) - 65;
    if (g >= 0 && g < 26 && counts[g] > 0) {
      feedback[i] = 'Y';
      counts[g]--;
    } else {
      feedback[i] = 'B';
    }
  }

  return feedback;
}