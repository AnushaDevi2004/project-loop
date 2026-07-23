import { prisma } from "@/lib/prisma";
import { analyzeWithClaude } from "./claude.service";

export async function analyzeFeedback(feedbackId: string) {
  console.log("Step 1: Finding feedback...");

  const feedback = await prisma.feedback.findUnique({
    where: {
      id: feedbackId,
    },
  });

  if (!feedback) {
    throw new Error("Feedback not found");
  }

  console.log("Step 2: Feedback found:", feedback);

  const result = await analyzeWithClaude(feedback.comment);

  console.log("Step 3: Claude Result:", result);

  const analysis = await prisma.aIAnalysis.create({
    data: {
      sentiment: result.sentiment,
      score: result.score,
      summary: result.summary,
      keywords: result.keywords,
      strengths: result.strengths,
      improvements: result.improvements,
      recommendation: result.recommendation,
      feedbackId,
    },
  });

  console.log("Step 4: Saved to database:", analysis);

  return analysis;
}

// Get AI Analysis by Feedback ID
export async function getAIAnalysisByFeedbackId(feedbackId: string) {
  const analysis = await prisma.aIAnalysis.findUnique({
    where: {
      feedbackId,
    },
    include: {
      feedback: true,
    },
  });

  if (!analysis) {
    throw new Error("AI Analysis not found");
  }

  return analysis;
}