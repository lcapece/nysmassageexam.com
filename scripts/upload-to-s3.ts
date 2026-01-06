import * as fs from "fs";
import * as path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Check for AWS credentials
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION || "us-east-1";

if (!awsAccessKey || !awsSecretKey) {
  console.error("ERROR: AWS_ACCESS_KEY and AWS_SECRET_ACCESS_KEY environment variables are required");
  process.exit(1);
}

const s3 = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
  },
});

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

async function uploadToS3(filePath: string, questionId: number): Promise<string | null> {
  try {
    const buffer = fs.readFileSync(filePath);
    const key = `${S3_PREFIX}/question-${questionId}.png`;

    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/png",
    }));

    return `https://${S3_BUCKET}.s3.amazonaws.com/${key}`;
  } catch (error: any) {
    console.error(`  ✗ Q${questionId} upload error:`, error?.message || error);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const testMode = args.includes("--test");
  const testCount = testMode ? 3 : undefined;
  const parallelCount = parseInt(args.find(a => a.startsWith("--parallel="))?.split("=")[1] || "10");

  // Find all images in temp-images folder
  const imagesDir = path.join(__dirname, "..", "temp-images");
  if (!fs.existsSync(imagesDir)) {
    console.error("ERROR: temp-images directory does not exist");
    process.exit(1);
  }

  const files = fs.readdirSync(imagesDir)
    .filter(f => f.startsWith("question-") && f.endsWith(".png"))
    .map(f => {
      const match = f.match(/question-(\d+)\.png/);
      return match ? { file: f, id: parseInt(match[1]) } : null;
    })
    .filter((f): f is { file: string; id: number } => f !== null)
    .sort((a, b) => a.id - b.id);

  console.log(`Found ${files.length} images to upload`);
  console.log(`S3 Bucket: ${S3_BUCKET}`);
  console.log(`S3 Prefix: ${S3_PREFIX}`);
  console.log(`Parallel uploads: ${parallelCount}`);

  let filesToProcess = files;
  if (testCount) {
    filesToProcess = files.slice(0, testCount);
    console.log(`\n🧪 TEST MODE: Uploading ${testCount} images`);
  }

  // Process in parallel batches
  const results: { id: number; success: boolean; url?: string }[] = [];

  for (let i = 0; i < filesToProcess.length; i += parallelCount) {
    const batch = filesToProcess.slice(i, i + parallelCount);
    console.log(`\nUploading batch ${Math.floor(i / parallelCount) + 1}: questions ${batch.map(f => f.id).join(", ")}`);

    const batchResults = await Promise.all(
      batch.map(async ({ file, id }) => {
        const filePath = path.join(imagesDir, file);
        const url = await uploadToS3(filePath, id);
        if (url) {
          console.log(`  ✓ Q${id} uploaded`);
          return { id, success: true, url };
        }
        return { id, success: false };
      })
    );

    results.push(...batchResults);
  }

  // Summary
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\n${"=".repeat(50)}`);
  console.log(`SUMMARY`);
  console.log(`${"=".repeat(50)}`);
  console.log(`Total uploaded: ${results.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log(`\nFailed IDs: ${failed.map(f => f.id).join(", ")}`);
  }

  // Update questions.ts with new URLs
  if (successful.length > 0 && !testMode) {
    console.log(`\nUpdating questions.ts with new image URLs...`);

    const questionsPath = path.join(__dirname, "..", "data", "questions.ts");
    const fileContent = fs.readFileSync(questionsPath, "utf-8");

    const jsonMatch = fileContent.match(/export const questions: Question\[\] = ([\s\S]*);/);
    if (!jsonMatch) {
      console.error("Could not parse questions file");
      process.exit(1);
    }

    const questions: Question[] = JSON.parse(jsonMatch[1]);

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
    console.log(`✓ Updated questions.ts with ${successful.length} new image URLs`);
  }
}

main().catch(console.error);
