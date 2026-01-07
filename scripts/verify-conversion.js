const fs = require('fs');
const content = fs.readFileSync('data/questions.ts', 'utf8');

// Count occurrences of markdown elements in first 48 questions
const firstPart = content.split('"id": 50,')[0]; // Get content before Q50

const keyConceptCount = (firstPart.match(/🎯 \*\*Key Concept\*\*:/g) || []).length;
const memoryTipCount = (firstPart.match(/💡 \*\*Memory Tip\*\*:/g) || []).length;
const examAlertCount = (firstPart.match(/⚠️ \*\*Exam Alert\*\*:/g) || []).length;
const whyCorrectCount = (firstPart.match(/✅ \*\*Why Correct\*\*:/g) || []).length;
const escapedNewlines = (firstPart.match(/\\\\n\\\\n/g) || []).length;

console.log('Markdown Format Analysis (Questions 1-48):');
console.log('==========================================');
console.log(`🎯 Key Concept sections: ${keyConceptCount}`);
console.log(`💡 Memory Tip sections: ${memoryTipCount}`);
console.log(`⚠️ Exam Alert sections: ${examAlertCount}`);
console.log(`✅ Why Correct sections: ${whyCorrectCount}`);
console.log(`\\n\\n escape sequences: ${escapedNewlines}`);
console.log(`\nExpected: 47 of each (Q45 is missing)`);

if (keyConceptCount >= 47 && memoryTipCount >= 47 && examAlertCount >= 47 && whyCorrectCount >= 47 && escapedNewlines >= 141) {
  console.log(`\n🎉 SUCCESS! All questions 1-48 (excluding Q45) have proper markdown formatting!`);
} else {
  console.log(`\n⚠️  Some conversions may be incomplete`);
}

// Show sample from Q1
const q1Match = content.match(/"id": 1,[\s\S]*?"topic_explanation": "([^"]+)"/);
if (q1Match) {
  console.log('\n\nSample - Question 1 topic_explanation:');
  console.log('======================================');
  console.log(q1Match[1].substring(0, 200) + '...');
}
