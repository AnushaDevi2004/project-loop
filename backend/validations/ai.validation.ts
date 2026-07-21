import { z } from "zod";

export const analyzeFeedbackSchema = z.object({
  feedbackId: z.string().min(1, "Feedback ID is required"),
});

export type AnalyzeFeedbackInput = z.infer<
  typeof analyzeFeedbackSchema
>;