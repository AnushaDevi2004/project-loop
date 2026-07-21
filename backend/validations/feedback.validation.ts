import { z } from "zod";

export const createFeedbackSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters"),

  userId: z.string().min(1, "User ID is required"),

  projectId: z.string().min(1, "Project ID is required"),
});

export type CreateFeedbackInput = z.infer<
  typeof createFeedbackSchema
>;