/* 
server\src\assets\csv\fuldformsliste.csv

csv file with format:
A-aktie;A-aktier;sb.
A-aktie;A-aktiers;sb.
ab;ab;præp.
abandonnere;abandonnere;vb.
abandonnere;abandonner;vb.
abandonnere;abandonneret;vb.
abandonnere;abandonnerer;vb.
abandonnere;abandonnerende;vb.
abandonnere;abandonnerede;vb.
abandonnere;abandonneres;vb.

*/
import { readFileSync } from "fs";

const CSV_FILE_PATH = "D:\\GitProjects\\ordish\\server\\src\\assets\\csv\\fuldformsliste.csv";
export interface WordEntry {
  singular: string;
  plural: string;
  type: string;
}

export class Words {
  private words: WordEntry[] = [];
  private validWords: string[] = [];

  public loadWords() {
    if (this.words.length > 0) return; // Already loaded

    const csvContent = readFileSync(CSV_FILE_PATH, "utf-8");
    const parsed = csvContent
      .split("\n")
      .map((line) => {
        const [singular, plural, type] = line.split(";").map(
          (part) => part.trim().replace(/[\r\n]/g, "") // Remove any newline characters
        );

        return { singular, plural, type };
      })
      .filter((entry) => entry.singular && entry.plural && entry.type); // Filter out any empty entries
    this.words = parsed as WordEntry[];
    console.log(`Loaded ${this.words.length} words from ${CSV_FILE_PATH}`);

    this.validWords = this.words
  .filter((word) => word.plural.length === 5)
  .filter((word) => !word.plural.includes("'") && !word.plural.includes("-"))
  .filter((word) => word.plural === word.plural.toLowerCase())
  .filter((word) => word.singular === word.plural) // lemma forms only
  .filter((word) => /^[a-zæøå]+$/.test(word.plural)) // only Danish alphabet
  .filter((word) => ["sb.", "vb.", "adj.", "adv."].includes(word.type.trim()))
  .map((word) => word.plural);
  }

  public getWords(): WordEntry[] {
    this.loadWords();
    return this.words;
  }

  public getValidWords(): string[] {
    this.loadWords();
    return this.validWords;
  }

  public getAllUniqueTypes(): string[] {
    this.loadWords();
    const types = new Set<string>();
    for (const word of this.words) {
      types.add(word.type);
    }
    return Array.from(types);
  }
}

/*
let words = new Words();
let valid = words.getValidWords();

console.log("Five-letter words: " + valid.slice(0, 10).join(", ") + " ... (" + valid.length + " total)")
*/