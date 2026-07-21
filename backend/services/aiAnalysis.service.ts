import { prisma } from "@/lib/prisma";
import { analyzeWithClaude } from "./claude.service";

export async function analyzeFeedback(feedbackId: string) {
  const feedback = await prisma.feedback.findUnique({
    where: {
      id: feedbackId,
    },
  });

  if (!feedback) {
    throw new Error("Feedback not found");
  }

  const result = await analyzeWithClaude(feedback.comment);

  return prisma.aIAnalysis.create({
    data: {
      sentiment: result.sentiment,
      score: result.score,
      summary: result.summary,
      keywords: result.keywords,
      feedbackId,
    },
  });
}