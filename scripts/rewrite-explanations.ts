import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

// Check for API key
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("ERROR: ANTHROPIC_API_KEY environment variable is required");
  console.error("Run: set ANTHROPIC_API_KEY=your-api-key-here");
  console.error("Then run this script again");
  process.exit(1);
}

const client = new Anthropic({ apiKey });

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

const REWRITE_PROMPT = `You are a friendly, casual exam prep coach helping massage therapy students pass the NYS Massage Therapy Exam.

Rewrite the following explanation to be:
- Casual, friendly, and fun - like a helpful friend coaching you
- STRICTLY focused on how to get this answer correct on the exam
- Short paragraph format, easy to scan quickly
- Every sentence must be geared toward passing the test
- Express a sense of urgency ("You NEED to know this!", "Don't overthink it!")
- Include practical tips to remember the correct answer
- Keep approximately the same length as the original
- NO formal educational tone - this is about PASSING, not learning everything

Original question: {question}
Correct answer: {answer}
Mnemonic: {mnemonic}

Original explanation:
{explanation}

Rewrite this explanation in the exam-prep style described above. Return ONLY the rewritten explanation, nothing else.`;

async function rewriteExplanation(
  question: string,
  answer: string,
  mnemonic: string,
  explanation: string
): Promise<string> {
  const prompt = REWRITE_PROMPT
    .replace("{question}", question)
    .replace("{answer}", answer)
    .replace("{mnemonic}", mnemonic)
    .replace("{explanation}", explanation);

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type === "text") {
    return content.text.trim();
  }
  throw new Error("Unexpected response type");
}

async function main() {
  // Read the questions file
  const questionsPath = path.join(__dirname, "..", "data", "questions.ts");
  const fileContent = fs.readFileSync(questionsPath, "utf-8");

  // Extract the questions array (remove the import and export parts)
  const jsonMatch = fileContent.match(/export const questions: Question\[\] = (\[[\s\S]*\]);/);
  if (!jsonMatch) {
    console.error("Could not parse questions file");
    process.exit(1);
  }

  const questions: Question[] = JSON.parse(jsonMatch[1]);
  console.log(`Found ${questions.length} questions to process`);

  // Process in batches to avoid rate limits
  const batchSize = 5;
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    console.log(`\nProcessing questions ${i + 1} to ${Math.min(i + batchSize, questions.length)}...`);

    const promises = batch.map(async (q) => {
      try {
        const answer = q.correct_answer_text || q.options[q.correct_option || "a"] || "N/A";
        const newExplanation = await rewriteExplanation(
          q.question,
          answer,
          q.mnemonic,
          q.topic_explanation
        );
        console.log(`  ✓ Question ${q.id} done`);
        return { id: q.id, explanation: newExplanation };
      } catch (error) {
        console.error(`  ✗ Question ${q.id} failed:`, error);
        return { id: q.id, explanation: q.topic_explanation }; // Keep original on failure
      }
    });

    const results = await Promise.all(promises);

    // Update questions with new explanations
    for (const result of results) {
      const question = questions.find((q) => q.id === result.id);
      if (question) {
        question.topic_explanation = result.explanation;
      }
    }

    // Save progress after each batch
    const outputContent = `import { Question } from "./types";

export const questions: Question[] = ${JSON.stringify(questions, null, 2)};
`;
    fs.writeFileSync(questionsPath, outputContent);
    console.log(`  Saved progress to file`);

    // Delay between batches to avoid rate limits
    if (i + batchSize < questions.length) {
      console.log(`  Waiting 2 seconds before next batch...`);
      await delay(2000);
    }
  }

  console.log("\n✅ All explanations rewritten successfully!");
}

main().catch(console.error);
