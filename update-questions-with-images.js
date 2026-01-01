const fs = require('fs');

// Load questions and progress
const questions = JSON.parse(fs.readFileSync('./data/questions.json', 'utf8'));
const imageUrls = JSON.parse(fs.readFileSync('./image-generation-progress.json', 'utf8'));

console.log(`Questions: ${questions.length}`);
console.log(`Image URLs: ${Object.keys(imageUrls).length}`);

// Add image_url to each question
const updatedQuestions = questions.map(q => ({
  ...q,
  image_url: imageUrls[q.id] || null
}));

// Count how many have images
const withImages = updatedQuestions.filter(q => q.image_url).length;
console.log(`Questions with images: ${withImages}`);

// Write updated questions
fs.writeFileSync('./data/questions.json', JSON.stringify(updatedQuestions, null, 2));
console.log('Updated data/questions.json');

// Generate TypeScript file
let tsContent = 'import { Question } from "./types";\n\nexport const questions: Question[] = ';
tsContent += JSON.stringify(updatedQuestions, null, 2);
tsContent += ';\n';
fs.writeFileSync('./data/questions.ts', tsContent);
console.log('Updated data/questions.ts');

console.log('Done!');
