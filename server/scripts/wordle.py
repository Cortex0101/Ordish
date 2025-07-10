import math
import json
import time
import os
from collections import defaultdict
from multiprocessing import Pool, cpu_count
import sys
import threading

CSV_FILE = "fuldformsliste.csv"
START_WORD = "sarte"
MAX_DEPTH = 6
SAVE_INTERVAL = 60 * 5
CHECKPOINT_FILE = "sarte_1_step.checkpoint.json"
FINAL_FILE = "sarte_1_step.json"

_last_checkpoint = time.time()
_last_worker_print = 0  # Track last worker print time

# --- Load word list ---
def load_solutions(path):
    with open(path, 'r', encoding='utf-8') as f:
        return [w.strip().replace('é','e') for w in f if len(w.strip()) == 5 and w.strip().isalpha() and w.strip().islower()]

# --- Feedback logic ---
def get_feedback(guess, solution):
    fb = ['B'] * 5
    sol = list(solution)
    for i, ch in enumerate(guess):
        if ch == sol[i]:
            fb[i], sol[i] = 'G', None
    for i, ch in enumerate(guess):
        if fb[i] == 'B' and ch in sol:
            fb[i], sol[sol.index(ch)] = 'Y', None
    return ''.join(fb)

# --- Entropy ---
def entropy_of_guess(guess, solutions):
    counts = defaultdict(int)
    for s in solutions:
        counts[get_feedback(guess, s)] += 1
    total = len(solutions)
    ent = sum(-c / total * math.log2(c / total) for c in counts.values())
    return ent, counts

# --- Worker function for parallel entropy calculation ---
def calculate_entropy_worker(args):
    guess, solutions = args
    return guess, entropy_of_guess(guess, solutions)[0]

# --- Guess selection with parallel processing ---
def select_best_guess(solutions, allowed):
    print(f"    Using greedy search on {len(solutions)} solutions with {len(allowed)} candidates...", flush=True)
    args = [(g, solutions) for g in allowed]
    with Pool(cpu_count()) as pool:
        results = pool.map(calculate_entropy_worker, args)
    max_entropy = max(ent for _, ent in results)
    candidates = [g for g, ent in results if abs(ent - max_entropy) < 1e-6]
    print(f"    Best greedy entropy: {max_entropy:.4f}, {len(candidates)} candidates", flush=True)

    # Prefer words that are in the solution set
    for word in candidates:
        if word in solutions:
            return word
    return candidates[0]

# --- Save checkpoint ---
def save_checkpoint(tree):
    global _last_checkpoint
    with open(CHECKPOINT_FILE, 'w', encoding='utf-8') as f:
        json.dump(tree, f, ensure_ascii=False, indent=2)
    print(f"[{time.strftime('%X')}] Checkpoint saved", flush=True)
    _last_checkpoint = time.time()

# --- Recursive tree building with depth-first search ---
def build_tree(node, state, solutions, allowed, depth=0):
    global _last_checkpoint
    
    # Save checkpoint every 5 minutes
    if time.time() - _last_checkpoint > SAVE_INTERVAL:
        save_checkpoint(partial_tree)
    
    # Base cases
    if depth >= MAX_DEPTH or len(solutions) <= 1:
        node.update({'state': state, 'solutions': solutions})
        print(f"{'  ' * depth}Depth {depth}: Terminal node with {len(solutions)} solutions", flush=True)
        return

    # If node already has branches, continue processing them
    if node.get('branches'):
        print(f"{'  ' * depth}Depth {depth}: Resuming existing node with guess '{node['guess']}'", flush=True)
        for pat, child in node['branches'].items():
            subset = [w for w in solutions if get_feedback(node['guess'], w) == pat]
            if subset:
                build_tree(child, state + [(node['guess'], pat)], subset, allowed, depth + 1)
        return

    # Choose strategy - always use greedy (1-step lookahead)
    
    print(f"{'  ' * depth}Depth {depth}: Processing {len(solutions)} solutions (greedy)", flush=True)
    
    # Special case for depth 0 - use START_WORD
    if depth == 0:
        guess = START_WORD
        print(f"{'  ' * depth}Depth {depth}: Using START_WORD '{guess}'", flush=True)
    else:
        guess = select_best_guess(solutions, allowed)
        print(f"{'  ' * depth}Depth {depth}: Selected guess '{guess}'", flush=True)

    # Calculate entropy and patterns
    ent, pat_counts = entropy_of_guess(guess, solutions)
    node.update({
        'state': state,
        'guess': guess,
        'entropy': ent,
        'branches': {}
    })
    
    print(f"{'  ' * depth}Depth {depth}: Guess '{guess}' entropy={ent:.4f} branches={len(pat_counts)}", flush=True)

    # Process each pattern
    for i, (pat, cnt) in enumerate(pat_counts.items()):
        subset = [w for w in solutions if get_feedback(guess, w) == pat]
        if not subset:
            continue
        
        print(f"{'  ' * depth}Depth {depth}: Processing pattern {i+1}/{len(pat_counts)}: '{pat}' ({len(subset)} solutions)", flush=True)
        node['branches'][pat] = {}
        build_tree(node['branches'][pat], state + [(guess, pat)], subset, allowed, depth + 1)

# --- Start checkpoint thread ---
def start_checkpoint_thread(tree):
    def checkpoint_thread():
        while True:
            time.sleep(SAVE_INTERVAL)
            save_checkpoint(tree)
    
    checkpoint_daemon = threading.Thread(target=checkpoint_thread, daemon=True)
    checkpoint_daemon.start()
    return checkpoint_daemon

# --- Main logic ---
if __name__ == '__main__':
    print(f"Starting Wordle solver with {cpu_count()} CPU cores", flush=True)
    
    try:
        with open(CHECKPOINT_FILE, 'r', encoding='utf-8') as f:
            partial_tree = json.load(f)
            print(f"Resuming from checkpoint {CHECKPOINT_FILE}...", flush=True)
    except FileNotFoundError:
        partial_tree = {}
        print("No checkpoint found. Starting from scratch.", flush=True)

    wordlist = load_solutions(CSV_FILE)
    print(f"Loaded {len(wordlist)} words", flush=True)
    
    # Start automatic checkpoint saving
    checkpoint_daemon = start_checkpoint_thread(partial_tree)
    
    start = time.time()
    build_tree(partial_tree, [], wordlist, wordlist)
    duration = time.time() - start

    # Final save
    with open(FINAL_FILE, 'w', encoding='utf-8') as f:
        json.dump(partial_tree, f, ensure_ascii=False, indent=2)
    print(f"Final tree written to {FINAL_FILE}. Total time: {duration:.2f} seconds", flush=True)