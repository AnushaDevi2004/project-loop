import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "ANALYST", "USER"]),
});

export type UpdateUserRoleInput = z.infer<
  typeof updateUserRoleSchema
>;