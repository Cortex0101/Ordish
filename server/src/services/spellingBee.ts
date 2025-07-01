import fs from "fs";
import { log } from "../utils/logger.js";

export class SpellingBeeService {
  wordList: string[] = [];

  SpellingBeeService() {
    // load words from server\src\assets\csv\fuldformsliste.csv
    log.info("SpellingBeeService initialized");
    this.loadWordList();
  }

  loadWordList() {
    const filePath = new URL("../assets/csv/fuldformsliste.csv", import.meta.url);
    log.info("Loading word list from", { path: filePath.pathname });

    const data = fs.readFileSync(filePath, "utf8");
    // Split the file content by new lines and filter out empty lines
    for (const line of data.split("\n")) {
      const words = line.split(";");
      const word = words[1].trim();
      // Check if the word is contains ', -, or has a capital letter
        if (word && !word.includes("'") && !word.includes("-") && word[0] === word[0].toLowerCase()) {
            this.wordList.push(word);
        }
    }
  }
}
