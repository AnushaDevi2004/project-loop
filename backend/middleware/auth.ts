import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function authenticate(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  console.log("Token:", token);

  try {
    const decoded = verifyToken(token);

    console.log("Decoded Token:", decoded);

    return decoded;
  } catch (error) {
    console.error("JWT Error:", error);
    throw new Error("Invalid or expired token");
  }
}