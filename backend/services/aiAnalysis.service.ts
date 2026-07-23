import { prisma } from "@/lib/prisma";
import { analyzeWithClaude } from "./claude.service";

export async function analyzeFeedback(feedbackId: string) {
  // Find feedback
  const feedback = await prisma.feedback.findUnique({
    where: {
      id: feedbackId,
    },
  });

  if (!feedback) {
    throw new Error("Feedback not found");
  }

  // Analyze feedback using Claude (mock for now)
  const result = await analyzeWithClaude(feedback.comment);

  // Save AI analysis
  return prisma.aIAnalysis.create({
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