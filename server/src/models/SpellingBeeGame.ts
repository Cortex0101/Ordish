// A spelling bee game 
export class SpellingBeeGame {
    id: number;
    puzzleId: number;
    letters: string[]; // first letter is center letter, always contains 3 vowels and 4 consonants
    validWords: Set<string>; // set of valid words for this puzzle
    maxPoints: number; // maximum possible points
    twoLetterPrefixes: Record<string, Set<string>>; // mapping of first letter to set of second letters for valid two-letter prefixes
    grid: SpellingBeeRow[]; // rows of the grid
}
