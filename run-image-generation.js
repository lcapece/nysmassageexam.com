const fs = require('fs');

const SUPABASE_URL = 'https://ekklokrukxmqlahtonnc.supabase.co';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/generate-question-images`;
const BATCH_SIZE = 5; // Process 5 questions per batch to avoid timeout

async function runBatch(questions, startIdx, endIdx) {
  const batch = questions.slice(startIdx, endIdx);

  console.log(`\nProcessing batch: questions ${batch[0]?.id} to ${batch[batch.length-1]?.id}...`);

  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questions: batch })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Function error: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function main() {
  // Load questions
  const questions = JSON.parse(fs.readFileSync('./data/questions.json', 'utf8'));
  console.log(`Total questions: ${questions.length}`);

  // Load progress
  const progressFile = './image-generation-progress.json';
  let progress = {};
  if (fs.existsSync(progressFile)) {
    progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
    console.log(`Already completed: ${Object.keys(progress).length}`);
  }

  // Filter out already processed
  const remaining = questions.filter(q => !progress[q.id]);
  console.log(`Remaining to process: ${remaining.length}`);

  if (remaining.length === 0) {
    console.log('All images already generated!');
    return;
  }

  // Process in batches
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    try {
      const result = await runBatch(remaining, i, i + BATCH_SIZE);

      console.log(`Batch result: ${result.successful} success, ${result.failed} failed`);

      // Save progress
      for (const r of result.results) {
        if (r.success) {
          progress[r.id] = r.image_url;
          successCount++;
        } else {
          errorCount++;
          console.log(`  Error for ${r.id}: ${r.error}`);
        }
      }

      fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));

      // Small delay between batches
      await new Promise(r => setTimeout(r, 2000));

    } catch (error) {
      console.error(`Batch failed:`, error.message);
      errorCount += BATCH_SIZE;
    }
  }

  console.log(`\n=== COMPLETE ===`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total in progress file: ${Object.keys(progress).length}`);
}

main().catch(console.error);
