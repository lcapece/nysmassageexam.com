#!/usr/bin/env python3
import re

# Read the JavaScript file
with open('scripts/convert-1-48-final.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace \\n\\n with \\\\n\\\\n in the markdownContent object
# We need to be careful to only replace within the string values, not elsewhere
# Match the pattern of question entries
def replace_escapes(match):
    # Get the full matched string
    full_match = match.group(0)
    # Replace \\n\\n with \\\\n\\\\n
    # In the regex, \\n matches literal \n in the file
    # We want to replace it with \\\\n (which will be \\ + n + \\ + n in the file)
    fixed = full_match.replace('\\n\\n', '\\\\n\\\\n')
    return fixed

# Match question definitions: number: "content",
pattern = r'(\d+):\s*"([^"]+)",'

content = re.sub(pattern, replace_escapes, content)

# Write back
with open('scripts/convert-1-48-final.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed escaping in convert-1-48-final.js")
