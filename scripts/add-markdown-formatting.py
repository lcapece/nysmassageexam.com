#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add markdown formatting to topic_explanation fields.
PRESERVES all original casual text - just adds emojis, bold, and line breaks.
"""
import re

def add_markdown(text):
    """Add markdown formatting while preserving original content."""

    # Add emojis and bold at the start
    text = re.sub(r'^Listen up\s*[-–—]?\s*', '🎯 **Listen up** - ', text)

    # Pro tip with line break before
    text = re.sub(r'Pro tip:', '\n\n💡 **Pro tip:**', text)
    text = re.sub(r'Remember:', '\n\n💡 **Remember:**', text)

    # Don't overthink with emoji
    text = re.sub(r"Don't overthink", "⚠️ **Don't overthink**", text)

    # Bold important ALL CAPS words (with word boundaries)
    text = re.sub(r'(?<!\*)\bNEED\b(?!\*)', '**NEED**', text)
    text = re.sub(r'(?<!\*)\bALL the time\b(?!\*)', '**ALL the time**', text)
    text = re.sub(r'(?<!\*)\bLAST thing\b(?!\*)', '**LAST thing**', text)
    text = re.sub(r'(?<!\*)\bevery single time\b(?!\*)', '**every single time**', text)
    text = re.sub(r'(?<!\*)\bmoney shot\b(?!\*)', '**money shot**', text)
    text = re.sub(r'(?<!\*)\bNEVER\b(?!\*)', '**NEVER**', text)
    text = re.sub(r'(?<!\*)\bALWAYS\b(?!\*)', '**ALWAYS**', text)

    # Bold key exam phrases
    text = re.sub(r'(?<!\*)go-to answer(?!\*)', '**go-to answer**', text, flags=re.IGNORECASE)
    text = re.sub(r"(?<!\*)that's your(?!\*)", "**that's your**", text, flags=re.IGNORECASE)
    text = re.sub(r"(?<!\*)always going to be(?!\*)", "**always going to be**", text)
    text = re.sub(r"(?<!\*)key point(?!\*)", "**key point**", text, flags=re.IGNORECASE)

    # Add line break after mnemonic
    text = re.sub(r'(Remember your mnemonic:[^.!]+[.!])\s*(?!\\n)', r'\1\n\n', text)

    return text

def main():
    with open('data/questions.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all topic_explanation fields and enhance them
    # Match everything including escaped quotes \" until the final unescaped "
    pattern = r'("topic_explanation":\s*")((?:[^"\\]|\\.)*)"'

    def replacer(match):
        prefix = match.group(1)
        text = match.group(2)

        # Unescape newlines for processing (keep \" as-is)
        unescaped = text.replace('\\n', '\n')

        # Temporarily replace \" to protect them during processing
        unescaped = unescaped.replace('\\"', '\x00QUOTE\x00')

        # Add markdown formatting
        formatted = add_markdown(unescaped)

        # Restore quotes and re-escape newlines
        formatted = formatted.replace('\x00QUOTE\x00', '\\"')
        escaped = formatted.replace('\n', '\\n')

        return f'{prefix}{escaped}"'

    new_content = re.sub(pattern, replacer, content)

    with open('data/questions.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)

    bold_count = new_content.count('**')
    emoji_count = new_content.count('🎯') + new_content.count('💡') + new_content.count('⚠️')
    linebreak_count = new_content.count('\\n\\n')
    print(f"Added: {emoji_count} emojis, {bold_count//2} bold markers, {linebreak_count} line breaks")

if __name__ == "__main__":
    main()
