#!/usr/bin/env python3
"""Split questions JSON into individual files for parallel processing."""
import json
import os

# Read the original questions
with open('/home/ubuntu/massage_therapy_exam_app/original_questions.json', 'r') as f:
    questions = json.load(f)

print(f"Total questions: {len(questions)}")

# Create output directory
output_dir = '/home/ubuntu/massage_therapy_exam_app/question_batches'
os.makedirs(output_dir, exist_ok=True)

# Split into batches of 10 questions each for parallel processing
batch_size = 10
batches = []
for i in range(0, len(questions), batch_size):
    batch = questions[i:i+batch_size]
    batch_num = i // batch_size + 1
    batch_file = f'{output_dir}/batch_{batch_num:03d}.json'
    with open(batch_file, 'w') as f:
        json.dump(batch, f, indent=2)
    batches.append(batch_file)
    print(f"Created {batch_file} with {len(batch)} questions")

print(f"\nTotal batches created: {len(batches)}")
print("Batch files:")
for b in batches:
    print(b)
