#!/usr/bin/env python3
"""
Fix escaping in data/questions.ts for questions 1-48.
Ensure that topic_explanation contains \\n\\n (literal backslash-n, two characters)
NOT \n (actual newline character).
"""

import re

# Read the file as bytes to handle exact byte sequences
with open('data/questions.ts', 'rb') as f:
    content = f.read()

# Track statistics
fixed_count = 0
already_correct = 0

# Find all topic_explanation fields for questions 1-48
# We'll process the file line by line
lines = content.split(b'\n')
new_lines = []
current_id = 0

for line in lines:
    # Track current question ID
    id_match = re.search(rb'"id":\s*(\d+),', line)
    if id_match:
        current_id = int(id_match.group(1))

    # Check if this line contains topic_explanation for questions 1-48
    if b'"topic_explanation":' in line and 1 <= current_id <= 48:
        # Count the different escape sequences
        # b'\x5c\x6e' = \n (one backslash + n) - WRONG
        # b'\x5c\x5c\x6e' = \\n (two backslashes + n) - CORRECT

        # Replace single \n with \\n (but only if it's an escape sequence, not actual newline)
        # Pattern: \x5c\x6e (backslash followed by 'n')
        # But we need to avoid replacing \\n (which is already correct)

        # Strategy: Replace all \n\n with \\n\\n
        # In bytes: \x5c\x6e\x5c\x6e -> \x5c\x5c\x6e\x5c\x5c\x6e

        # First, check if it needs fixing
        if b'\\n\\n' in line and b'\\\\n\\\\n' not in line:
            # Has \n\n but not \\n\\n - needs fixing
            # Replace \n with \\n
            fixed_line = line.replace(b'\\n', b'\\\\n')
            new_lines.append(fixed_line)
            fixed_count += 1
            print(f'Fixed Q{current_id}')
        elif b'\\\\n\\\\n' in line:
            # Already correct
            new_lines.append(line)
            already_correct += 1
            print(f'Q{current_id} already correct')
        else:
            # No markdown format or different format
            new_lines.append(line)
            print(f'Q{current_id} - no markdown escaping found')
    else:
        new_lines.append(line)

# Join and write
new_content = b'\n'.join(new_lines)

with open('data/questions.ts', 'wb') as f:
    f.write(new_content)

print(f'\nSummary:')
print(f'Fixed: {fixed_count}')
print(f'Already correct: {already_correct}')
print(f'Total Q1-48 (excl Q45): 47')
