import { z } from "zod";

// Create Project Schema
export const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// Update Project Schema
export const updateProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;