const fs = require('fs');

// Read original data with categories (from git)
const originalData = JSON.parse(fs.readFileSync('data/questions_with_categories.json', 'utf8'));
console.log('Original data count:', originalData.length);

// Read new data
const newData = JSON.parse(fs.readFileSync('nys2.json', 'utf8'));
console.log('New data count:', newData.length);

// Create a map of id -> category from original data
const categoryMap = {};
originalData.forEach(q => {
  categoryMap[q.id] = q.category;
});

// Add category to new data
let unmatchedCount = 0;
const mergedData = newData.map(q => {
  const category = categoryMap[q.id];
  if (!category) {
    unmatchedCount++;
    console.log('No category for id:', q.id);
  }
  return {
    id: q.id,
    question: q.question,
    options: q.options,
    correct_option: q.correct_option,
    correct_answer_text: q.correct_answer_text,
    rewrite_question: q.rewrite_question,
    mnemonic: q.mnemonic,
    topic_explanation: q.topic_explanation,
    incorrect_explanations: q.incorrect_explanations,
    visual_aid_prompt: q.visual_aid_prompt,
    category: category || 'Uncategorized'
  };
});

console.log('Merged data count:', mergedData.length);
console.log('Unmatched count:', unmatchedCount);

// Write merged data to questions.json
fs.writeFileSync('data/questions.json', JSON.stringify(mergedData, null, 2));
console.log('Written to data/questions.json');

// Generate TypeScript file
let tsContent = 'import { Question } from "./types";\n\nexport const questions: Question[] = ';
tsContent += JSON.stringify(mergedData, null, 2);
tsContent += ';\n';
fs.writeFileSync('data/questions.ts', tsContent);
console.log('Written to data/questions.ts');
