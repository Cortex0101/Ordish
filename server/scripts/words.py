from wordfreq import zipf_frequency
import unicodedata
import re

INPUT = 'D:/GitProjects/ordish/server/src/assets/csv/fuldformsliste.csv'
OUTPUT = 'common_dansk_words.txt'
THRESHOLD = 3

# word struct (base_word, form_word, type, frequency)
class Word:
    def __init__(self, base_word: str, form_word: str, type: str, frequency: float):
        self.base_word = base_word
        self.form_word = form_word
        self.type = type
        self.frequency = frequency

    def __repr__(self):
        return f"Word(base_word={self.base_word}, form_word={self.form_word}, type={self.type}, frequency={self.frequency})"

class Words:
    def __init__(self):
        self.ALL_WORDS = []
        self.ALL_INCLUDED_WORDS = []
        self.ALL_COMMON_WORDS = []
        self._included_types = ["sb.", "vb.", "adj.", "adv."]
        self._load_all_words()
        self._load_included_words()
        self._load_common_words()

    def _normalize(self, w: str) -> str:
        return unicodedata.normalize("NFC", w.strip()).lower()
    
    def _is_excluded(self, w: str) -> bool:
        '''
        Check if a word should be excluded based on certain criteria:
        - Contains numbers
        - Contains punctuation
        - Contains spaces or hyphens
        '''
        return re.search(r"[0-9]", w) or re.search(r"[^\w\s]", w) or re.search(r"\s", w) or re.search(r"-", w) or re.search(r"'", w)

    def _load_all_words(self):
        if not self.ALL_WORDS:
            with open(INPUT, encoding="utf-8") as input_file:
                for line in input_file:
                    raw = line.split(";")
                    word = Word(self._normalize(raw[0]), 
                                self._normalize(raw[1]), 
                                raw[2].strip(), 
                                zipf_frequency(self._normalize(raw[0]), 'da'))
                    self.ALL_WORDS.append(word)

    def _load_included_words(self):
        if not self.ALL_INCLUDED_WORDS:
            for word in self.ALL_WORDS:
                if word.type in self._included_types and not self._is_excluded(word.base_word) and not self._is_excluded(word.form_word):
                    self.ALL_INCLUDED_WORDS.append(word)

    def _load_common_words(self):
        if not self.ALL_COMMON_WORDS:
            for word in self.ALL_INCLUDED_WORDS:
                if word.frequency > THRESHOLD:
                    self.ALL_COMMON_WORDS.append(word)
    
    def get_all_words(self):
        if not self.ALL_WORDS:
            self._load_all_words()
        return self.ALL_WORDS
    
    def get_included_words(self):
        if not self.ALL_INCLUDED_WORDS:
            self._load_included_words()
        return self.ALL_INCLUDED_WORDS
    
    def get_common_words(self):
        if not self.ALL_COMMON_WORDS:
            self._load_common_words()
        return self.ALL_COMMON_WORDS
    
if __name__ == "__main__":
    words = Words()
    all_words = words.get_all_words()
    included_words = words.get_included_words()
    common_words = words.get_common_words()

    print(f"Total words loaded: {len(all_words)}")
    print(f"Included words: {len(included_words)}")
    print(f"Common words (frequency > {THRESHOLD}): {len(common_words)}")
    with open(OUTPUT, "w", encoding="utf-8") as output_file:
        for word in common_words:
            output_file.write(f"{word.base_word}; {word.form_word}; {word.type}; {word.frequency}\n")