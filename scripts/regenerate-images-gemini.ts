import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Check for API keys
const googleApiKey = process.env.GOOGLE_GEMINI_API_KEY;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION || "us-east-1";

if (!googleApiKey) {
  console.error("ERROR: GOOGLE_GEMINI_API_KEY environment variable is required");
  process.exit(1);
}

if (!awsAccessKey || !awsSecretKey) {
  console.error("ERROR: AWS_ACCESS_KEY and AWS_SECRET_ACCESS_KEY are required for S3 upload");
  console.error("Running in local-only mode...");
}

// Initialize clients
const ai = new GoogleGenAI({ apiKey: googleApiKey });
const s3 = awsAccessKey && awsSecretKey ? new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
  },
}) : null;

const S3_BUCKET = "nysmassageexam-images";
const S3_PREFIX = "diagrams";

interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  correct_option: string | null;
  correct_answer_text: string | null;
  rewrite_question: string;
  mnemonic: string;
  topic_explanation: string;
  incorrect_explanations: Record<string, string>;
  visual_aid_prompt: string;
  category: string;
  image_url?: string;
}

async function generateImage(prompt: string, questionId: number): Promise<Buffer | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        return Buffer.from(imageData, "base64");
      }
    }
    return null;
  } catch (error: any) {
    console.error(`  ✗ Q${questionId} generation error:`, error?.message || error);
    return null;
  }
}

async function uploadToS3(buffer: Buffer, questionId: number): Promise<string | null> {
  if (!s3) return null;

  try {
    const key = `${S3_PREFIX}/question-${questionId}.png`;
    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/png",
    }));
    return `https://${S3_BUCKET}.s3.amazonaws.com/${key}`;
  } catch (error: any) {
    console.error(`  ✗ Q${questionId} S3 upload error:`, error?.message || error);
    return null;
  }
}

async function processQuestion(question: Question, outputDir: string): Promise<{ id: number; success: boolean; url?: string }> {
  const imageBuffer = await generateImage(question.visual_aid_prompt, question.id);

  if (!imageBuffer) {
    return { id: question.id, success: false };
  }

  // Save locally
  const localPath = path.join(outputDir, `question-${question.id}.png`);
  fs.writeFileSync(localPath, imageBuffer);

  // Upload to S3 if configured
  let url: string | undefined;
  if (s3) {
    const s3Url = await uploadToS3(imageBuffer, question.id);
    if (s3Url) {
      url = s3Url;
    }
  }

  console.log(`  ✓ Q${question.id} done (${(imageBuffer.length / 1024).toFixed(0)} KB)${url ? ' + S3' : ''}`);
  return { id: question.id, success: true, url };
}

async function processBatch(questions: Question[], outputDir: string, batchNum: number): Promise<{ id: number; success: boolean; url?: string }[]> {
  console.log(`\n[Batch ${batchNum}] Processing ${questions.length} questions: ${questions.map(q => q.id).join(', ')}`);

  const results = await Promise.all(
    questions.map(q => processQuestion(q, outputDir))
  );

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const testMode = args.includes("--test");
  const testCount = testMode ? 3 : undefined;
  const startId = parseInt(args.find(a => a.startsWith("--start="))?.split("=")[1] || "1");
  const parallelBatches = parseInt(args.find(a => a.startsWith("--parallel="))?.split("=")[1] || "4");
  const batchSize = parseInt(args.find(a => a.startsWith("--batch="))?.split("=")[1] || "4");

  // Create output directory
  const outputDir = path.join(__dirname, "..", "temp-images");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read questions file
  const questionsPath = path.join(__dirname, "..", "data", "questions.ts");
  const fileContent = fs.readFileSync(questionsPath, "utf-8");

  const jsonMatch = fileContent.match(/export const questions: Question\[\] = (\[[\s\S]*\]);/);
  if (!jsonMatch) {
    console.error("Could not parse questions file");
    process.exit(1);
  }

  const questions: Question[] = JSON.parse(jsonMatch[1]);
  console.log(`Found ${questions.length} questions total`);
  console.log(`S3 Upload: ${s3 ? 'ENABLED' : 'DISABLED (local only)'}`);

  // Filter questions
  let questionsToProcess = questions.filter(q => q.id >= startId);
  if (testCount) {
    questionsToProcess = questionsToProcess.slice(0, testCount);
    console.log(`\n🧪 TEST MODE: Processing ${testCount} questions`);
  } else {
    console.log(`\nProcessing ${questionsToProcess.length} questions (parallel=${parallelBatches}, batch=${batchSize})`);
  }

  // Process in parallel batches
  const allResults: { id: number; success: boolean; url?: string }[] = [];
  const effectiveBatchSize = batchSize * parallelBatches;

  for (let i = 0; i < questionsToProcess.length; i += effectiveBatchSize) {
    const superBatch = questionsToProcess.slice(i, i + effectiveBatchSize);
    const batches: Question[][] = [];

    for (let j = 0; j < superBatch.length; j += batchSize) {
      batches.push(superBatch.slice(j, j + batchSize));
    }

    console.log(`\n${"=".repeat(50)}`);
    console.log(`Processing ${superBatch.length} questions (${i + 1}-${Math.min(i + effectiveBatchSize, questionsToProcess.length)} of ${questionsToProcess.length})`);

    // Run parallel batches
    const batchPromises = batches.map((batch, idx) =>
      processBatch(batch, outputDir, Math.floor(i / batchSize) + idx + 1)
    );

    const batchResults = await Promise.all(batchPromises);
    allResults.push(...batchResults.flat());

    // Rate limit delay between super-batches
    if (i + effectiveBatchSize < questionsToProcess.length) {
      console.log(`\nWaiting 3 seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Summary
  const successful = allResults.filter(r => r.success);
  const failed = allResults.filter(r => !r.success);

  console.log(`\n${"=".repeat(50)}`);
  console.log(`SUMMARY`);
  console.log(`${"=".repeat(50)}`);
  console.log(`Total processed: ${allResults.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log(`\nFailed IDs: ${failed.map(f => f.id).join(", ")}`);
  }

  // Update questions.ts with new URLs if S3 was used
  if (s3 && successful.some(r => r.url) && !testMode) {
    console.log(`\nUpdating questions.ts with new image URLs...`);
    for (const result of successful) {
      if (result.url) {
        const q = questions.find(q => q.id === result.id);
        if (q) {
          q.image_url = result.url;
        }
      }
    }

    const outputContent = `import { Question } from "./types";

export const questions: Question[] = ${JSON.stringify(questions, null, 2)};
`;
    fs.writeFileSync(questionsPath, outputContent);
    console.log(`✓ Updated questions.ts`);
  }

  console.log(`\n📁 Images saved to: ${outputDir}`);
}

main().catch(console.error);
