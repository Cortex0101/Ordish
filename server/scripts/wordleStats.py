import json
from collections import defaultdict

# Configuration
TREE_FILE = "D:/TREE_FIXED.json"
START_WORD = "sarte"
MAX_DEPTH = 7
WORDLIST = "D:/GitProjects/ordish/server/src/assets/csv/fuldformsliste.csv"

# Load tree
with open(TREE_FILE, 'r', encoding='utf-8') as f:
    tree = json.load(f)

# Load solution words
with open(WORDLIST, 'r', encoding='utf-8') as f:
    # abbed;abbed;sb.
    #abbed;abbeden;sb.
    #abbed;abbedens;sb.
    #abbed;abbeds;sb.
    # read the center word ;
    lines = f.readlines()
    # filter for 5-letter words, remove accents, and ensure lowercase
    # and only include words that are alphabetic
    words = [line.split(';')[1] for line in lines if len(line.split(';')) > 0]
    solutions = []
    for word in words:
        if len(word) == 5 and word.isalpha() and word.islower():
            solutions.append(word)
    solutions = set(solutions)  # Remove duplicates
    solutions = list(solutions)  # Convert back to list for easier handling
    print(f"Loaded {len(solutions)} solution words from {WORDLIST}")

# Wordle feedback function
def get_feedback(guess, solution):
    fb = ['B'] * 5
    sol = list(solution)
    for i, ch in enumerate(guess):
        if ch == sol[i]:
            fb[i] = 'G'
            sol[i] = None
    for i, ch in enumerate(guess):
        if fb[i] == 'B' and ch in sol:
            fb[i] = 'Y'
            sol[sol.index(ch)] = None
    return ''.join(fb)

# Compute full statistics
def compute_stats(node, depth=1):
    if 'solutions' in node:
        n = len(node['solutions'])
        return n, n * depth, {depth: n}, node['solutions'] if depth == MAX_DEPTH else []
    total_n = 0
    total_sum = 0
    depth_counts = defaultdict(int)
    worst_words = []
    for child in node.get('branches', {}).values():
        n, s, dc, ww = compute_stats(child, depth + 1)
        total_n += n
        total_sum += s
        worst_words.extend(ww)
        for d, c in dc.items():
            depth_counts[d] += c
    return total_n, total_sum, depth_counts, worst_words

# Trace solution path
def get_solution_path(tree, secret):
    path = []
    node = tree
    depth = 0
    while depth <= MAX_DEPTH and node:
        guess = node.get('guess')
        if not guess:
            break
        fb = get_feedback(guess, secret)
        path.append({'guess': guess, 'feedback': fb})
        if fb == 'GGGGG':
            break
        node = node.get('branches', {}).get(fb)
        depth += 1
    return path

# --- Main ---
total, sum_depths, depth_counts, worst_words = compute_stats(tree)
avg_guesses = sum_depths / total
worst_case = max(depth_counts)

print("Feedack for Fynbo/foton")
res = get_feedback("foton", "fynbo")
print(res)

print(f"Statistics for '{START_WORD}':")
print(f"  Total words: {total}")
print(f"  Average guesses: {avg_guesses:.3f}")
print(f"  Worst-case guesses: {worst_case}\n")

print("Depth distribution:")
for depth in sorted(depth_counts):
    count = depth_counts[depth]
    pct = count / total * 100
    print(f"  Depth {depth}: {count} words ({pct:.1f}% )")

print("\nSolution paths for secrets requiring 7 guesses:")
for secret in sorted(worst_words)[0:5]:
    path = get_solution_path(tree, secret)
    print(f"\nSecret: {secret}")
    remaining = list(solutions)
    for step_num, step in enumerate(path, 1):
        guess = step['guess']
        fb = step['feedback']
        print(f"  Step {step_num}: guess = {guess}, feedback = {fb}, remaining: {len(remaining)}, {remaining if len(remaining) < 10 else 'too many'}")
        remaining = [w for w in remaining if get_feedback(guess, w) == fb]
