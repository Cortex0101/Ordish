import fs from "fs";
import { Table } from "console-table-printer";

export class Puzzle {
  center: string;
  consonants: string[];
  vowels: string[];
  totalWords: number;
  totalPoints: number;
  pangramCount: number;
  rowCounts: Record<string, Record<number, number>>;
  colTotals: Record<number, number>;
  prefixCounts: Record<string, Record<string, number>>;

  constructor(
    center: string,
    consonants: string[],
    vowels: string[],
    totalWords: number,
    totalPoints: number,
    pangramCount: number,
    rowCounts: Record<string, Record<number, number>>,
    colTotals: Record<number, number>,
    prefixCounts: Record<string, Record<string, number>>
  ) {
    this.center = center;
    this.consonants = consonants;
    this.vowels = vowels;
    this.totalWords = totalWords;
    this.totalPoints = totalPoints;
    this.pangramCount = pangramCount;
    this.rowCounts = rowCounts;
    this.colTotals = colTotals;
    this.prefixCounts = prefixCounts;
  }

  printTable() {
    const all = [
      this.center,
      ...[...this.consonants, ...this.vowels].sort(),
    ];

    // 1) Print two-letter prefixes
    for (const first of all) {
      const seconds = this.prefixCounts[first] || {};
      const parts: string[] = [];
      for (const second of all) {
        const cnt = seconds[second];
        if (cnt) parts.push(`${first}${second}-${cnt}`);
      }
      if (parts.length) console.log(parts.join(" "));
    }
    console.log("");

    // 2) Print NYT-style grid
    console.log(all.join(" "));
    console.log(
      `WORDS: ${this.totalWords}, POINTS: ${this.totalPoints}, PANGRAMS: ${this.pangramCount}`
    );

    const lengths = Object.keys(this.colTotals)
      .map((n) => +n)
      .filter((n) => n >= 4 && this.colTotals[n]! > 0)
      .sort((a, b) => a - b);

    const columns = [
      { name: "", alignment: "left" },
      ...lengths.map((n) => ({ name: `${n}`, alignment: "right" })),
      { name: "Σ", alignment: "right" },
    ];
    const table = new Table({ columns });

    for (const L of all) {
      const sum = lengths.reduce(
        (s, n) => s + (this.rowCounts[L][n] || 0),
        0
      );
      if (!sum) continue;

      const row: Record<string, string | number> = { "": L };
      for (const n of lengths) {
        row[`${n}`] = this.rowCounts[L][n] || "-";
      }
      row["Σ"] = sum;
      table.addRow(row);
    }

    // Footer Σ-row
    const footer: Record<string, string | number> = { "": "Σ" };
    for (const n of lengths) {
      footer[`${n}`] = this.colTotals[n] || "-";
    }
    footer["Σ"] = this.totalWords;
    table.addRow(footer);

    table.printTable();
  }
}

interface WordData {
  word: string;
  mask: number;
  len: number;
  first: string;
  baseScore: number;
}

export class SpellingBee {
  WORD_LIST: string[] = [];
  letterIndex: Record<string, number> = {};
  centerWords: Record<string, WordData[]> = {};

  CONSONANTS = [
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "q",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "z",
  ];
  VOWELS = ["a", "e", "i", "o", "u", "y", "æ", "ø", "å"];

  constructor() {
    this.loadWordList();
    this.buildIndices();
  }

  loadWordList() {
    const filePath = new URL(
      "../src/assets/csv/fuldformsliste.csv",
      import.meta.url
    );
    const data = fs.readFileSync(filePath, "utf8");
    for (const line of data.split("\n")) {
      const parts = line.split(";");
      if (!parts[1]) continue;
      const w = parts[1].trim();
      if (
        w &&
        w === w.toLowerCase() &&
        !w.includes("'") &&
        !w.includes("-") &&
        !w.includes(" ") &&
        !w.includes(".") 
      ) {
        this.WORD_LIST.push(w);
      }
    }
  }

  buildIndices() {
    // map each letter to a bit index
    const allLetters = [...this.CONSONANTS, ...this.VOWELS];
    allLetters.forEach((ch, i) => {
      this.letterIndex[ch] = i;
    });

    // init per-center buckets
    for (const c of this.CONSONANTS) {
      this.centerWords[c] = [];
    }

    // build WordData and slot into buckets
    for (const w of this.WORD_LIST) {
      if (w.length < 4) continue;
      let mask = 0;
      for (const ch of w) {
        mask |= 1 << this.letterIndex[ch];
      }
      const wd: WordData = {
        word: w,
        mask,
        len: w.length,
        first: w[0],
        baseScore: Math.max(w.length - 3, 1),
      };
      for (const c of this.CONSONANTS) {
        const bit = 1 << this.letterIndex[c];
        if ((mask & bit) !== 0) {
          this.centerWords[c].push(wd);
        }
      }
    }
  }

  combinations<T>(arr: T[], k: number): T[][] {
    const res: T[][] = [];
    const combo: T[] = [];
    const n = arr.length;
    const dfs = (start: number) => {
      if (combo.length === k) {
        res.push(combo.slice());
        return;
      }
      for (let i = start; i < n; i++) {
        combo.push(arr[i]);
        dfs(i + 1);
        combo.pop();
      }
    };
    dfs(0);
    return res;
  }

  findValidPuzzles(
    numConsonants: number,
    numVowels: number,
    minScore = 150,
    maxScore = 250,
    limit = Infinity
  ): Puzzle[] {
    if (numConsonants + numVowels !== 7) {
      throw new Error("consonants + vowels must equal 7");
    }

    const results: Puzzle[] = [];

    for (const center of this.CONSONANTS) {
      const bucket = this.centerWords[center];
      if (!bucket.length) continue;

      const others = this.CONSONANTS.filter((c) => c !== center);
      for (const consCombo of this.combinations(others, numConsonants - 1)) {
        let consMask = 0;
        for (const c of consCombo) {
          consMask |= 1 << this.letterIndex[c];
        }

        for (const vowelCombo of this.combinations(
          this.VOWELS,
          numVowels
        )) {
          let vowelMask = 0;
          for (const v of vowelCombo) {
            vowelMask |= 1 << this.letterIndex[v];
          }

          const centerMask = 1 << this.letterIndex[center];
          const puzzleMask = centerMask | consMask | vowelMask;
          const header = [
            center,
            ...[...consCombo, ...vowelCombo].sort(),
          ];

          const rowCounts: Record<string, Record<number, number>> = {};
          const colTotals: Record<number, number> = {};
          const prefixCounts: Record<string, Record<string, number>> = {};

          for (const L of header) {
            rowCounts[L] = {};
            prefixCounts[L] = {};
          }

          let totalWords = 0;
          let words: string[] = [];
          let totalPoints = 0;
          let pangramCount = 0;

          for (const wd of bucket) {
            if ((wd.mask & ~puzzleMask) !== 0) continue;

            words.push(wd.word);
            totalWords++;
            const isPangram = (wd.mask & puzzleMask) === puzzleMask;
            if (isPangram) {
              pangramCount++;
              console.log(
                `Pangram found: ${wd.word} (${wd.mask.toString(2)})`
              );
            }

            const pts = wd.baseScore + (isPangram ? 7 : 0);
            totalPoints += pts;
            if (totalPoints > maxScore) break;

            // grid counts
            rowCounts[wd.first][wd.len] =
              (rowCounts[wd.first][wd.len] || 0) + 1;
            colTotals[wd.len] = (colTotals[wd.len] || 0) + 1;

            // prefix counts for first two letters
            const w = wd.word;
            const p0 = w[0],
              p1 = w[1];
            if (header.includes(p1)) {
              prefixCounts[p0][p1] =
                (prefixCounts[p0][p1] || 0) + 1;
            }
          }

          if (
            pangramCount > 0 &&
            totalPoints >= minScore &&
            totalPoints <= maxScore
          ) {
            results.push(
              new Puzzle(
                center,
                consCombo,
                vowelCombo,
                totalWords,
                totalPoints,
                pangramCount,
                rowCounts,
                colTotals,
                prefixCounts
              )
            );
            console.log(words)
            if (results.length >= limit) return results;
          }
        }
      }
    }

    return results;
  }
}

// Example usage:
const sb = new SpellingBee();
const now = new Date();
const puzzles = sb.findValidPuzzles(4, 3, 100, 175, 1);
console.log("Generated puzzles " + puzzles.length + " in " + (new Date().getTime() - now.getTime()) + "ms");
if (puzzles.length > 0) {
  puzzles[0].printTable();
}
