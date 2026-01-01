const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const S3_BUCKET = 'nysmassageexam-images';
const OUTPUT_DIR = './generated-images';

// Gemini API endpoint for image generation
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

async function generateImage(prompt, questionId) {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Generate an educational medical diagram: ${prompt}`
        }]
      }],
      generationConfig: {
        responseModalities: ["image", "text"],
        responseMimeType: "image/png"
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  // Extract image data from response
  if (data.candidates && data.candidates[0]?.content?.parts) {
    for (const part of data.candidates[0].content.parts) {
      if (part.inlineData) {
        return Buffer.from(part.inlineData.data, 'base64');
      }
    }
  }

  throw new Error('No image data in response');
}

async function uploadToS3(imageBuffer, questionId) {
  const fileName = `question-${questionId}.png`;
  const tempPath = path.join(OUTPUT_DIR, fileName);

  // Write to temp file
  fs.writeFileSync(tempPath, imageBuffer);

  // Upload to S3
  execSync(`aws s3 cp "${tempPath}" s3://${S3_BUCKET}/diagrams/${fileName} --content-type image/png`, {
    stdio: 'inherit'
  });

  return `https://${S3_BUCKET}.s3.amazonaws.com/diagrams/${fileName}`;
}

async function processQuestions() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load questions
  const questions = JSON.parse(fs.readFileSync('./data/questions.json', 'utf8'));

  // Track progress
  const progressFile = './image-generation-progress.json';
  let progress = {};
  if (fs.existsSync(progressFile)) {
    progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  }

  console.log(`Starting image generation for ${questions.length} questions...`);
  console.log(`Already completed: ${Object.keys(progress).length}`);

  const results = [];
  let successCount = Object.keys(progress).length;
  let errorCount = 0;

  for (const question of questions) {
    // Skip if already processed
    if (progress[question.id]) {
      results.push({ id: question.id, image_url: progress[question.id] });
      continue;
    }

    try {
      console.log(`[${question.id}/${questions.length}] Generating image...`);

      const imageBuffer = await generateImage(question.visual_aid_prompt, question.id);
      const imageUrl = await uploadToS3(imageBuffer, question.id);

      progress[question.id] = imageUrl;
      results.push({ id: question.id, image_url: imageUrl });

      // Save progress after each successful generation
      fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));

      successCount++;
      console.log(`[${question.id}] ✓ Success: ${imageUrl}`);

      // Rate limiting - 15 requests per minute for free tier
      await new Promise(resolve => setTimeout(resolve, 4500));

    } catch (error) {
      errorCount++;
      console.error(`[${question.id}] ✗ Error: ${error.message}`);
      results.push({ id: question.id, error: error.message });
    }
  }

  console.log(`\nComplete! Success: ${successCount}, Errors: ${errorCount}`);

  // Save final results
  fs.writeFileSync('./image-generation-results.json', JSON.stringify(results, null, 2));

  return results;
}

// Run
processQuestions().catch(console.error);
