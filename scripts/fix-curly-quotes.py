#!/usr/bin/env python3
import re

with open('data/questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace curly quotes with escaped straight quotes
# Unicode: LEFT DOUBLE QUOTATION MARK U+201C, RIGHT DOUBLE QUOTATION MARK U+201D
content = content.replace('\u201c', r'\"')  # Left curly quote
content = content.replace('\u201d', r'\"')  # Right curly quote

with open('data/questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed curly quotes')
