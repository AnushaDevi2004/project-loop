import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/validations/login.validation";
import { loginUser } from "@/services/login.service";

export async function POST(request: NextRequest) {
  try {
    // Read request body
    const body = await request.json();

    // Validate request
    const validatedData = loginSchema.parse(body);

    // Login user
    const result = await loginUser(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}