import math
import json
from collections import defaultdict
from multiprocessing import Pool, cpu_count

CSV_FILE_PATH = "D:\\GitProjects\\ordish\\server\\src\\assets\\csv\\fuldformsliste.csv"
RESULTS_JSON_PATH = "results.json"

def load_words(file_path):
    words = set()
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            parts = line.strip().split(';')
            if len(parts) > 1:
                word = parts[1]
                if len(word) == 5 and word.isalpha() and word.islower():
                    # if word has é, replace with e
                    word = word.replace('é', 'e')
                    words.add(word)
    return list(words)

solutions = load_words(CSV_FILE_PATH)
allowed_guesses = solutions  # assuming identical for simplicity

print(f"Loaded {len(solutions)} five-letter words from {CSV_FILE_PATH}")
# save to words.txt
with open("words.txt", 'w', encoding='utf-8') as f:
    for word in solutions:
        f.write(word + "\n")
        
exit()

def get_feedback(guess, solution):
    feedback = ['B'] * 5
    solution_chars = list(solution)
    for i in range(5):
        if guess[i] == solution_chars[i]:
            feedback[i] = 'G'
            solution_chars[i] = None
    for i in range(5):
        if feedback[i] == 'B' and guess[i] in solution_chars:
            feedback[i] = 'Y'
            solution_chars[solution_chars.index(guess[i])] = None
    return ''.join(feedback)

def compute_entropy(args):
    guess, possible_solutions = args
    pattern_counts = defaultdict(int)
    for solution in possible_solutions:
        pattern_counts[get_feedback(guess, solution)] += 1
    total = len(possible_solutions)
    entropy = sum(-p/total * math.log2(p/total) for p in pattern_counts.values())
    return guess, round(entropy, 4), pattern_counts

def build_state_tree(state_history, possible_solutions, allowed_guesses, depth=0, max_depth=6):
    state_desc = [f"{guess}:{fb}" for guess, fb in state_history]

    if depth >= max_depth or len(possible_solutions) == 1:
        return {
            "state": state_desc,
            "possible_words": possible_solutions,
            "guesses": [{"word": possible_solutions[0], "ent": 0}] if len(possible_solutions) == 1 else []
        }

    with Pool(cpu_count()) as pool:
        results = pool.map(compute_entropy, [(guess, possible_solutions) for guess in allowed_guesses])

    sorted_guesses = sorted(results, key=lambda x: x[1], reverse=True)

    guesses_list = [{"word": word, "ent": ent} for word, ent, _ in sorted_guesses]

    node = {
        "state": state_desc,
        "possible_words": possible_solutions,
        "guesses": guesses_list,
        "next_states": {}
    }

    # Recurse for each feedback of optimal guess (for full traversal)
    optimal_guess, _, optimal_patterns = sorted_guesses[0]

    for pattern in optimal_patterns:
        filtered_solutions = [w for w in possible_solutions if get_feedback(optimal_guess, w) == pattern]
        if filtered_solutions:
            new_history = state_history + [(optimal_guess, pattern)]
            node["next_states"][f"{optimal_guess}:{pattern}"] = build_state_tree(
                new_history, filtered_solutions, allowed_guesses, depth + 1, max_depth
            )

    return node

def main():
    root = build_state_tree([], solutions, allowed_guesses)

    with open(RESULTS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(root, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
