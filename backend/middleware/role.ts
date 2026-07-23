import { NextRequest } from "next/server";
import { authenticate } from "./auth";

export function authorize(
  request: NextRequest,
  allowedRoles: string[]
) {
  const user = authenticate(request) as {
    id: string;
    email: string;
    role: string;
  };

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden: You don't have permission");
  }

  return user;
}