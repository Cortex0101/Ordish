import { wordleFeedback } from "./Feedback";
import { Words, WordEntry } from "./Words";

let res = wordleFeedback("huset", "huset");
console.log(res); // Expected: ['G', 'G', 'G', 'G','

let valid = new Words().getValidWords();
console.log("Five-letter words: " + valid.slice(0, 10).join(", ") + " ... (" + valid.length + " total)")

// Get entropy of a word
function getEntropy(guess: string, validWords: string[]): number {
  const feedbackCounts: Record<string, number> = {};
  for (const word of validWords) {
    const feedback = wordleFeedback(guess, word).join('');
    feedbackCounts[feedback] = (feedbackCounts[feedback] || 0) + 1;
  }

  let entropy = 0;
  const total = validWords.length;
  for (const count of Object.values(feedbackCounts)) {
    const probability = count / total;
    entropy -= probability * Math.log2(probability);
  }
  
  return entropy;
}

let wordEntropy: Record<string, number> = {};

for (const word of valid) {
    const entropy = getEntropy(word, valid);
    wordEntropy[word] = entropy;
    console.log(`Entropy of "${word}": ${entropy.toFixed(2)}`);
}

// Sort words by entropy
const sortedWords = Object.entries(wordEntropy).sort((a, b) => b[1] - a[1]);
console.log("Top 10 words by entropy:");
sortedWords.slice(0, 10).forEach(([word, entropy]) => {
    console.log(`Word: ${word}, Entropy: ${entropy.toFixed(2)}`);
});