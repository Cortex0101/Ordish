# open out.txt
from collections import defaultdict
import json
import os

output_file = "server/scripts/out.txt"
#load line by line
'''
[18:27:15] Completed 1/187 branches (0.5%)
Worker Depth 1: greedy on 5 solutions...
Worker Depth 1: chose 'frækt'
Worker Depth 1: 'frækt' ent=1.9219 branches=4
Worker Depth 2: greedy on 2 solutions...
Worker Depth 2: chose 'baret'
Worker Depth 2: 'baret' ent=1.0000 branches=2
[18:27:16] Completed 2/187 branches (1.1%)
Worker Depth 1: greedy on 5 solutions...
Worker Depth 1: chose 'dvask'
Worker Depth 1: 'dvask' ent=1.9219 branches=4
Worker Depth 2: greedy on 2 solutions...
Worker Depth 2: chose 'stage'
Worker Depth 2: 'stage' ent=1.0000 branches=2
'''

depth1lines = []
depth2lines = []
depth3lines = []
depth4lines = []
depth5lines = []
depth6lines = []

with open(output_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        # group by depth
        if 'Worker Depth 1:' in line:
            depth1lines.append(line.strip())
        elif 'Worker Depth 2:' in line:
            depth2lines.append(line.strip())
        elif 'Worker Depth 3:' in line:
            depth3lines.append(line.strip())
        elif 'Worker Depth 4:' in line:
            depth4lines.append(line.strip())
        elif 'Worker Depth 5:' in line:
            depth5lines.append(line.strip())
        elif 'Worker Depth 6:' in line:
            depth6lines.append(line.strip())

# Print average branches for each depth
def print_average_branches(depth_lines, depth):
    if not depth_lines:
        print(f"No data for Depth {depth}")
        return
    total_branches = 0
    count = 0
    for line in depth_lines:
        parts = line.split(' ')
        if 'on' in parts:
            branches = int(parts[parts.index('on') + 1])
            total_branches += branches
            count += 1
    if count > 0:
        average_branches = total_branches / count
        median = sorted([int(parts[parts.index('on') + 1]) for parts in depth_lines if 'on' in parts])[len(depth_lines) // 2]
        print(f"Average solutions for Depth {depth}: {average_branches:.2f}, Median: {median}")
    else:
        print(f"No branches data for Depth {depth}")

print_average_branches(depth1lines, 1)
print_average_branches(depth2lines, 2)
print_average_branches(depth3lines, 3)
print_average_branches(depth4lines, 4)
print_average_branches(depth5lines, 5)
print_average_branches(depth6lines, 6)