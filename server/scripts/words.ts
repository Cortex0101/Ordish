import fs from "fs";

class Words {
    WORD_LIST: string[] = [];

    constructor() {
        this.loadWordList();
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
}

let words = new Words();
console.log("Loaded " + words.WORD_LIST.length + " words from word list");