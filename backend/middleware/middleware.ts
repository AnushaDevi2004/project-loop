import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Token",
      },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/projects/:path*",
    "/api/feedback/:path*",
    "/api/users/:path*",
  ],
};